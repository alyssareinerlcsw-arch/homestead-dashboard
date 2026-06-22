import { NextResponse } from "next/server";
import { google } from "googleapis";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { sql } from "@/lib/db";

const CATEGORY_KEYS = ["lyra", "jfs", "caregiving", "kids", "home", "personal", "sidequests", "research", "finances"];

async function getAuthClient() {
  const rows = await sql`SELECT * FROM gmail_tokens WHERE id = 1`;
  if (!rows.length) return null;

  const token = rows[0] as { access_token: string; refresh_token: string; expiry_date: number | null };

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/gmail/callback`
  );

  auth.setCredentials({
    access_token: token.access_token,
    refresh_token: token.refresh_token,
    expiry_date: token.expiry_date ?? undefined,
  });

  // Persist refreshed tokens if they change
  auth.on("tokens", async (newTokens) => {
    await sql`
      UPDATE gmail_tokens SET
        access_token = ${newTokens.access_token ?? token.access_token},
        expiry_date = ${newTokens.expiry_date ?? null},
        updated_at = NOW()
      WHERE id = 1
    `;
  });

  return auth;
}

function decodeBase64(str: string) {
  return Buffer.from(str.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8");
}

function extractBody(payload: Record<string, unknown>): string {
  if (!payload) return "";
  const parts = payload.parts as Array<Record<string, unknown>> | undefined;
  const body = payload.body as { data?: string } | undefined;

  if (body?.data) return decodeBase64(body.data);

  if (parts) {
    for (const part of parts) {
      const partBody = part.body as { data?: string } | undefined;
      if ((part.mimeType === "text/plain" || part.mimeType === "text/html") && partBody?.data) {
        return decodeBase64(partBody.data);
      }
      // recurse for multipart
      if ((part.mimeType as string)?.startsWith("multipart/")) {
        const nested = extractBody(part);
        if (nested) return nested;
      }
    }
  }
  return "";
}

function getHeader(headers: Array<{ name: string; value: string }>, name: string) {
  return headers.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

export async function POST() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: "Gmail not configured" }, { status: 503 });
  }
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 503 });
  }

  const auth = await getAuthClient();
  if (!auth) {
    return NextResponse.json({ error: "Gmail not connected", needsAuth: true }, { status: 401 });
  }

  const gmail = google.gmail({ version: "v1", auth });

  // Fetch emails from last 48 hours, not promotional/social
  const since = Math.floor((Date.now() - 48 * 60 * 60 * 1000) / 1000);
  const query = `after:${since} -category:promotions -category:social -from:noreply -from:no-reply`;

  const listRes = await gmail.users.messages.list({
    userId: "me",
    q: query,
    maxResults: 30,
  });

  const messages = listRes.data.messages ?? [];
  if (!messages.length) {
    return NextResponse.json({ tasksCreated: 0, emailsScanned: 0 });
  }

  // Filter out already-processed emails
  const ids = messages.map((m) => m.id!);
  const processed = await sql`
    SELECT email_id FROM gmail_processed WHERE email_id = ANY(${ids})
  `;
  const processedIds = new Set((processed as Array<{ email_id: string }>).map((r) => r.email_id));
  const newIds = ids.filter((id) => !processedIds.has(id));

  if (!newIds.length) {
    return NextResponse.json({ tasksCreated: 0, emailsScanned: messages.length, message: "All emails already processed" });
  }

  // Fetch full content for new emails (cap at 20)
  const emailsToProcess = newIds.slice(0, 20);
  const emailContents: Array<{ id: string; from: string; subject: string; body: string }> = [];

  await Promise.all(
    emailsToProcess.map(async (id) => {
      try {
        const msg = await gmail.users.messages.get({ userId: "me", id, format: "full" });
        const headers = (msg.data.payload?.headers ?? []) as Array<{ name: string; value: string }>;
        const subject = getHeader(headers, "subject");
        const from = getHeader(headers, "from");
        const body = extractBody(msg.data.payload as Record<string, unknown>);
        // Strip HTML tags and trim
        const plainBody = body.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 2000);
        emailContents.push({ id, from, subject, body: plainBody });
      } catch {
        // skip emails we can't read
      }
    })
  );

  // Send to Gemini to extract tasks
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const emailSummary = emailContents
    .map((e, i) => `EMAIL ${i + 1}:\nFrom: ${e.from}\nSubject: ${e.subject}\nBody: ${e.body}`)
    .join("\n\n---\n\n");

  const result = await model.generateContent(`You are a personal assistant scanning emails to extract actionable tasks.

Available life-area categories: lyra (job at Lyra), jfs (job at JFS), caregiving (dad with dementia), kids, home, personal, sidequests, research, finances.

For each email, determine if it contains one or more concrete action items that require follow-up. Ignore newsletters, FYIs, receipts, and automated notifications that need no action.

Return ONLY valid JSON — an array of task objects (can be empty). Each task:
{
  "title": "concise action item (max 80 chars)",
  "description": "brief context from email (max 150 chars, optional)",
  "category": "one of the category keys above",
  "priority": "high | medium | low",
  "email_id": "the source email id from below"
}

Emails to analyze:
${emailSummary}

Email IDs in order: ${emailContents.map((e) => e.id).join(", ")}

Return ONLY the JSON array, no explanation.`);

  let extractedTasks: Array<{
    title: string; description?: string; category: string;
    priority: string; email_id: string;
  }> = [];

  try {
    const raw = result.response.text().trim();
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (jsonMatch) extractedTasks = JSON.parse(jsonMatch[0]);
  } catch {
    extractedTasks = [];
  }

  // Validate and insert tasks
  let tasksCreated = 0;
  for (const task of extractedTasks) {
    if (!task.title?.trim()) continue;
    const category = CATEGORY_KEYS.includes(task.category) ? task.category : "personal";
    const priority = ["high", "medium", "low"].includes(task.priority) ? task.priority : "medium";

    try {
      await sql`
        INSERT INTO tasks (title, description, priority, category)
        VALUES (${task.title.trim()}, ${task.description || null}, ${priority}, ${category})
      `;
      tasksCreated++;
    } catch { /* skip dupes */ }
  }

  // Mark all emails as processed (even ones with no tasks)
  if (emailsToProcess.length > 0) {
    await sql`
      INSERT INTO gmail_processed (email_id)
      SELECT unnest(${emailsToProcess}::text[])
      ON CONFLICT (email_id) DO NOTHING
    `;
  }

  return NextResponse.json({
    tasksCreated,
    emailsScanned: emailsToProcess.length,
    message: `Scanned ${emailsToProcess.length} emails, created ${tasksCreated} tasks`,
  });
}

export async function GET() {
  // Check connection status
  try {
    const rows = await sql`SELECT id, updated_at FROM gmail_tokens WHERE id = 1`;
    return NextResponse.json({ connected: rows.length > 0, updatedAt: rows[0]?.updated_at ?? null });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
