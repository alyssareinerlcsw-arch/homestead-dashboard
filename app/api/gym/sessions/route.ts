import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const sessions = await sql`
    SELECT * FROM gym_sessions ORDER BY session_date DESC, created_at DESC LIMIT 50
  `;
  return NextResponse.json(sessions);
}

export async function POST(req: NextRequest) {
  const { session_date, workout_type, duration_minutes, notes, exercises } = await req.json();
  if (!workout_type?.trim()) {
    return NextResponse.json({ error: "Workout type required" }, { status: 400 });
  }
  const [session] = await sql`
    INSERT INTO gym_sessions (session_date, workout_type, duration_minutes, notes, exercises)
    VALUES (
      ${session_date || new Date().toISOString().split("T")[0]},
      ${workout_type.trim()},
      ${duration_minutes || null},
      ${notes || null},
      ${JSON.stringify(exercises || [])}
    )
    RETURNING *
  `;
  return NextResponse.json(session, { status: 201 });
}
