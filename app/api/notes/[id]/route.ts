import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { title, content } = await req.json();
  const [note] = await sql`
    UPDATE notes
    SET title = ${title}, content = ${content}, updated_at = NOW()
    WHERE id = ${parseInt(params.id)}
    RETURNING *
  `;
  return NextResponse.json(note);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sql`DELETE FROM notes WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ ok: true });
}
