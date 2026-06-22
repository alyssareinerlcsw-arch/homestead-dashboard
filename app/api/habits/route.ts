import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const habits = await sql`SELECT * FROM habits ORDER BY created_at ASC`;
  const today = new Date().toISOString().split("T")[0];

  // Get today's logs and streaks for all habits
  const logs = await sql`
    SELECT habit_id, COUNT(*) as streak
    FROM habit_logs
    WHERE logged_date >= CURRENT_DATE - INTERVAL '60 days'
    GROUP BY habit_id
  `;

  const todayLogs = await sql`
    SELECT habit_id FROM habit_logs WHERE logged_date = ${today}
  `;

  const todaySet = new Set(todayLogs.map((l) => (l as { habit_id: number }).habit_id));
  const streakMap = new Map(logs.map((l) => [(l as { habit_id: number; streak: number }).habit_id, (l as { habit_id: number; streak: number }).streak]));

  const result = habits.map((h) => {
    const habit = h as { id: number };
    return {
      ...h,
      completed_today: todaySet.has(habit.id),
      recent_count: streakMap.get(habit.id) || 0,
    };
  });

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const { name, description, color } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  const [habit] = await sql`
    INSERT INTO habits (name, description, color)
    VALUES (${name.trim()}, ${description || null}, ${color || "#6B7C5C"})
    RETURNING *
  `;
  return NextResponse.json({ ...habit, completed_today: false, recent_count: 0 }, { status: 201 });
}
