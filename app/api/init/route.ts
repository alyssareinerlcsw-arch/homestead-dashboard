import { neon } from "@neondatabase/serverless";
import { INIT_SQL } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  const sql = neon(process.env.DATABASE_URL!);
  const statements = INIT_SQL
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  for (const statement of statements) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (sql as any)(statement);
    } catch (error) {
      console.error("DB init error on statement:", statement, error);
      return NextResponse.json({ error: "Failed to initialize database", detail: String(error) }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
