'use client';

import { useState } from 'react';

interface CashEntry {
  id: number;
  amount: number;
  currency: string;
  note: string | null;
  created_at: string;
}

interface CashSectionProps {
  entries: CashEntry[];
  onRefresh: () => void;
}

export default function CashSection({ entries, onRefresh }: CashSectionProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!amount) return;
    setLoading(true);
    await fetch('/api/cash', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(amount), note: note || undefined }),
    });
    setAmount('');
    setNote('');
    setLoading(false);
    onRefresh();
  }

  async function handleDelete(id: number) {
    await fetch('/api/cash', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">Cash</h3>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !amount}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-600">No cash entries yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
              <div>
                <span className="font-medium text-zinc-200">
                  ${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {entry.note && (
                  <span className="ml-2 text-sm text-zinc-500">{entry.note}</span>
                )}
              </div>
              <button
                onClick={() => handleDelete(entry.id)}
                className="text-xs text-zinc-600 hover:text-red-400"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
