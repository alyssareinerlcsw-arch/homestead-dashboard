import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const steps = await sql`
    SELECT * FROM daily_steps ORDER BY logged_date DESC LIMIT 30
  `;
  return NextResponse.json(steps);
}

export async function POST(req: NextRequest) {
  const { logged_date, step_count } = await req.json();
  const [row] = await sql`
    INSERT INTO daily_steps (logged_date, step_count)
    VALUES (${logged_date || new Date().toISOString().split("T")[0]}, ${step_count})
    ON CONFLICT (logged_date) DO UPDATE SET step_count = EXCLUDED.step_count
    RETURNING *
  `;
  return NextResponse.json(row, { status: 201 });
}
