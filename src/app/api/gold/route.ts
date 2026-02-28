import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM gold ORDER BY created_at DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { grams, note } = await req.json();
  if (!grams || typeof grams !== 'number' || grams <= 0) {
    return NextResponse.json({ error: 'Grams must be a positive number' }, { status: 400 });
  }
  const db = getDb();
  const result = db.prepare('INSERT INTO gold (grams, note) VALUES (?, ?)').run(grams, note || null);
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM gold WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
