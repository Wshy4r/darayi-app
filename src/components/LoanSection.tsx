'use client';

import { useState } from 'react';

interface LoanEntry {
  id: number;
  borrower_name: string;
  amount: number;
  currency: string;
  is_returned: number;
  created_at: string;
}

interface LoanSectionProps {
  entries: LoanEntry[];
  onRefresh: () => void;
}

export default function LoanSection({ entries, onRefresh }: LoanSectionProps) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !amount) return;
    setLoading(true);
    await fetch('/api/loans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ borrower_name: name, amount: parseFloat(amount) }),
    });
    setName('');
    setAmount('');
    setLoading(false);
    onRefresh();
  }

  async function handleToggleReturn(id: number, currentState: number) {
    await fetch('/api/loans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_returned: currentState ? 0 : 1 }),
    });
    onRefresh();
  }

  async function handleDelete(id: number) {
    await fetch('/api/loans', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    onRefresh();
  }

  const outstanding = entries.filter((e) => !e.is_returned);
  const returned = entries.filter((e) => e.is_returned);

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5">
      <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Money Lent Out
      </h3>

      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Borrower name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-28 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 focus:border-blue-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading || !name || !amount}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {outstanding.length === 0 && returned.length === 0 ? (
        <p className="text-sm text-zinc-600">No loans recorded.</p>
      ) : (
        <>
          {outstanding.length > 0 && (
            <ul className="mb-3 space-y-2">
              {outstanding.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleReturn(entry.id, entry.is_returned)}
                      className="h-4 w-4 rounded border border-zinc-600 hover:border-blue-400"
                      title="Mark as returned"
                    />
                    <div>
                      <span className="font-medium text-zinc-200">{entry.borrower_name}</span>
                      <span className="ml-2 text-blue-400">
                        ${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
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

          {returned.length > 0 && (
            <>
              <p className="mb-2 text-xs text-zinc-600">Returned</p>
              <ul className="space-y-2 opacity-50">
                {returned.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between rounded-lg bg-zinc-800/50 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleReturn(entry.id, entry.is_returned)}
                        className="flex h-4 w-4 items-center justify-center rounded border border-blue-500 bg-blue-500/20 text-xs text-blue-400"
                        title="Mark as outstanding"
                      >
                        &#10003;
                      </button>
                      <div>
                        <span className="font-medium text-zinc-400 line-through">{entry.borrower_name}</span>
                        <span className="ml-2 text-zinc-500 line-through">
                          ${entry.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
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
            </>
          )}
        </>
      )}
    </div>
  );
}
