import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const tasks = await sql`
    SELECT * FROM tasks ORDER BY completed ASC, due_date ASC NULLS LAST, created_at DESC
  `;
  return NextResponse.json(tasks);
}

export async function POST(req: NextRequest) {
  const { title, description, priority, due_date, category } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }
  const [task] = await sql`
    INSERT INTO tasks (title, description, priority, due_date, category)
    VALUES (${title.trim()}, ${description || null}, ${priority || "medium"}, ${due_date || null}, ${category || "personal"})
    RETURNING *
  `;
  return NextResponse.json(task, { status: 201 });
}
