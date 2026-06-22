import { neon } from "@neondatabase/serverless";
import { INIT_STATEMENTS } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  const sql = neon(process.env.DATABASE_URL!);

  for (const statement of INIT_STATEMENTS) {
    try {
      await sql(statement as unknown as TemplateStringsArray);
    } catch (error) {
      console.error("DB init error:", error);
      return NextResponse.json(
        { error: "Failed to initialize database", detail: String(error) },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ ok: true });
}
