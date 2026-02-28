import { getDb } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM loans ORDER BY is_returned ASC, created_at DESC').all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { borrower_name, amount, currency } = await req.json();
  if (!borrower_name || !amount) {
    return NextResponse.json({ error: 'Borrower name and amount are required' }, { status: 400 });
  }
  const db = getDb();
  const result = db
    .prepare('INSERT INTO loans (borrower_name, amount, currency) VALUES (?, ?, ?)')
    .run(borrower_name, amount, currency || 'USD');
  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, is_returned } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const db = getDb();
  db.prepare('UPDATE loans SET is_returned = ? WHERE id = ?').run(is_returned ? 1 : 0, id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  const db = getDb();
  db.prepare('DELETE FROM loans WHERE id = ?').run(id);
  return NextResponse.json({ ok: true });
}
