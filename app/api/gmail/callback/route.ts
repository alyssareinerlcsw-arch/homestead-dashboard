import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/tasks?gmail=error&reason=${error || "no_code"}`);
  }

  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${baseUrl}/api/gmail/callback`
  );

  try {
    const { tokens } = await auth.getToken(code);

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(`${baseUrl}/tasks?gmail=error&reason=no_tokens`);
    }

    await sql`
      INSERT INTO gmail_tokens (id, access_token, refresh_token, expiry_date, updated_at)
      VALUES (1, ${tokens.access_token}, ${tokens.refresh_token}, ${tokens.expiry_date ?? null}, NOW())
      ON CONFLICT (id) DO UPDATE SET
        access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expiry_date = EXCLUDED.expiry_date,
        updated_at = NOW()
    `;

    return NextResponse.redirect(`${baseUrl}/tasks?gmail=connected`);
  } catch (err) {
    console.error("Gmail OAuth error:", err);
    return NextResponse.redirect(`${baseUrl}/tasks?gmail=error&reason=token_exchange`);
  }
}
