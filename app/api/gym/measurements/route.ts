import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const measurements = await sql`
    SELECT * FROM body_measurements ORDER BY measurement_date DESC LIMIT 30
  `;
  const [goal] = await sql`SELECT * FROM body_goals ORDER BY created_at DESC LIMIT 1`;
  return NextResponse.json({ measurements, goal: goal || null });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type } = body;

  if (type === "goal") {
    const { target_weight_lbs, target_body_fat_pct, target_date, notes } = body;
    await sql`DELETE FROM body_goals`;
    const [goal] = await sql`
      INSERT INTO body_goals (target_weight_lbs, target_body_fat_pct, target_date, notes)
      VALUES (${target_weight_lbs || null}, ${target_body_fat_pct || null}, ${target_date || null}, ${notes || null})
      RETURNING *
    `;
    return NextResponse.json(goal, { status: 201 });
  }

  const { measurement_date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, arms_in, thighs_in, notes } = body;
  const [m] = await sql`
    INSERT INTO body_measurements (measurement_date, weight_lbs, body_fat_pct, chest_in, waist_in, hips_in, arms_in, thighs_in, notes)
    VALUES (
      ${measurement_date || new Date().toISOString().split("T")[0]},
      ${weight_lbs || null}, ${body_fat_pct || null},
      ${chest_in || null}, ${waist_in || null}, ${hips_in || null},
      ${arms_in || null}, ${thighs_in || null}, ${notes || null}
    )
    RETURNING *
  `;
  return NextResponse.json(m, { status: 201 });
}
