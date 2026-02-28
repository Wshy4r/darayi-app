'use client';

import { useState } from 'react';

interface GoldEntry {
  id: number;
  grams: number;
  note: string | null;
  created_at: string;
}

interface GoldSectionProps {
  entries: GoldEntry[];
  pricePerGram: number | null;
  priceUpdatedAt: string | null;
  onRefresh: () => void;
}

export default function GoldSection({ entries, pricePerGram, priceUpdatedAt, onRefresh }: GoldSectionProps) {
  const [grams, setGrams] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!grams) return;
    setLoading(true);
    await fetch('/api/gold', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grams: parseFloat(grams), note: note || undefined }),
    });
    setGrams('');
    setNote('');
    setLoading(false);
    onRefresh();
  }

  async function handleDelete(id: number) {
    await fetch('/api/gold', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wider text-zinc-500">Gold</h3>
        {pricePerGram ? (
          <div className="text-right">
            <span className="text-sm font-medium text-amber-400">
              ${pricePerGram.toFixed(2)}/g
            </span>
            {priceUpdatedAt && (
              <p className="text-xs text-zinc-600">
                Updated {new Date(priceUpdatedAt).toLocaleTimeString()}
              </p>
            )}
          </div>
        ) : (
          <span className="text-xs text-zinc-600">Price unavailable</span>
        )}
      </div>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="number"
          step="0.01"
          placeholder="Grams"
          value={grams}
          onChange={(e) => setGrams(e.target.value)}
          className="w-28 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !grams}
          className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {entries.length === 0 ? (
        <p className="text-sm text-zinc-600">No gold entries yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
              <div>
                <span className="font-medium text-amber-400">{entry.grams}g</span>
                {pricePerGram && (
                  <span className="ml-2 text-sm text-zinc-400">
                    ≈ ${(entry.grams * pricePerGram).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
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
