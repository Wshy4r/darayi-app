'use client';

interface VaultSummaryProps {
  totalCash: number;
  totalGoldValue: number;
  totalLoans: number;
  goldPricePerGram: number | null;
  totalGrams: number;
}

export default function VaultSummary({
  totalCash,
  totalGoldValue,
  totalLoans,
  goldPricePerGram,
  totalGrams,
}: VaultSummaryProps) {
  const total = totalCash + totalGoldValue + totalLoans;

  return (
    <div className="mb-8 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">
        Vault Total
      </h2>
      <p className="mb-6 text-4xl font-bold text-emerald-400">
        ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-xs text-zinc-500">Cash</p>
          <p className="text-lg font-semibold text-zinc-200">
            ${totalCash.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-xs text-zinc-500">Gold ({totalGrams.toFixed(1)}g)</p>
          <p className="text-lg font-semibold text-amber-400">
            ${totalGoldValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {goldPricePerGram && (
            <p className="text-xs text-zinc-600">
              ${goldPricePerGram.toFixed(2)}/g
            </p>
          )}
        </div>
        <div className="rounded-lg bg-zinc-800/50 p-3">
          <p className="text-xs text-zinc-500">Lent Out</p>
          <p className="text-lg font-semibold text-blue-400">
            ${totalLoans.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    </div>
  );
}
