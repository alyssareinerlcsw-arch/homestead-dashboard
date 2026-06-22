import { sql } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const body = await req.json();

  const fields: string[] = [];
  const values: unknown[] = [];

  if ("completed" in body) {
    fields.push(`completed = $${fields.length + 1}`);
    values.push(body.completed);
  }
  if ("title" in body) {
    fields.push(`title = $${fields.length + 1}`);
    values.push(body.title);
  }
  if ("priority" in body) {
    fields.push(`priority = $${fields.length + 1}`);
    values.push(body.priority);
  }
  if ("due_date" in body) {
    fields.push(`due_date = $${fields.length + 1}`);
    values.push(body.due_date || null);
  }
  if ("description" in body) {
    fields.push(`description = $${fields.length + 1}`);
    values.push(body.description || null);
  }

  if (fields.length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  values.push(id);
  const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`;
  const [task] = await sql(query, values);
  return NextResponse.json(task);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sql`DELETE FROM tasks WHERE id = ${parseInt(params.id)}`;
  return NextResponse.json({ ok: true });
}
