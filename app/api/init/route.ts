import { sql, INIT_SQL } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await sql(INIT_SQL);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DB init error:", error);
    return NextResponse.json({ error: "Failed to initialize database" }, { status: 500 });
  }
}
