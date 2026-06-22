import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const habitId = parseInt(params.id);
  const today = new Date().toISOString().split("T")[0];

  try {
    await sql`
      INSERT INTO habit_logs (habit_id, logged_date) VALUES (${habitId}, ${today})
    `;
    return NextResponse.json({ ok: true, logged: true });
  } catch {
    // Unique constraint — already logged, so unlog
    await sql`
      DELETE FROM habit_logs WHERE habit_id = ${habitId} AND logged_date = ${today}
    `;
    return NextResponse.json({ ok: true, logged: false });
  }
}

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const habitId = parseInt(params.id);
  const logs = await sql`
    SELECT logged_date FROM habit_logs
    WHERE habit_id = ${habitId}
    ORDER BY logged_date DESC
    LIMIT 90
  `;
  return NextResponse.json(logs.map((l: { logged_date: string }) => l.logged_date));
}
