import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const notes = await sql`SELECT * FROM notes ORDER BY updated_at DESC`;
  return NextResponse.json(notes);
}

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: "Title required" }, { status: 400 });
  }
  const [note] = await sql`
    INSERT INTO notes (title, content) VALUES (${title.trim()}, ${content || ""}) RETURNING *
  `;
  return NextResponse.json(note, { status: 201 });
}
