import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { title, description, target_date, progress, status } = body;
  const [goal] = await sql`
    UPDATE goals SET
      title = COALESCE(${title ?? null}, title),
      description = COALESCE(${description ?? null}, description),
      target_date = COALESCE(${target_date ?? null}::date, target_date),
      progress = COALESCE(${progress ?? null}, progress),
      status = COALESCE(${status ?? null}, status)
    WHERE id = ${parseInt(params.id)}
    RETURNING *
  `;
  return NextResponse.json(goal);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sql`DELETE FROM goals WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ ok: true });
}
