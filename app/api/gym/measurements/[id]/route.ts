import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sql`DELETE FROM body_measurements WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ ok: true });
}
