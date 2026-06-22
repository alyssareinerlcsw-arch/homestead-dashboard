import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const goals = await sql`SELECT * FROM goals ORDER BY status ASC, created_at DESC`;
  return NextResponse.json(goals);
}

export async function POST(req: NextRequest) {
  const { title, description, target_date, progress } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }
  const [goal] = await sql`
    INSERT INTO goals (title, description, target_date, progress)
    VALUES (${title.trim()}, ${description || null}, ${target_date || null}, ${progress || 0})
    RETURNING *
  `;
  return NextResponse.json(goal, { status: 201 });
}
