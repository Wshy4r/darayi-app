import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM cash ORDER BY created_at DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { amount, currency, note } = await req.json();
  if (!amount || typeof amount !== 'number') {
    return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
  }
  const db = getDb();
  const result = db.prepare('INSERT INTO cash (amount, currency, note) VALUES (?, ?, ?)').run(
    amount,
    currency || 'USD',
    note || null
  );
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM cash WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
