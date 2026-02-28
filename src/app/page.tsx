'use client';

import { useEffect, useState, useCallback } from 'react';
import VaultSummary from '@/components/VaultSummary';
import CashSection from '@/components/CashSection';
import GoldSection from '@/components/GoldSection';
import LoanSection from '@/components/LoanSection';

interface CashEntry {
  id: number;
  amount: number;
  currency: string;
  note: string | null;
  created_at: string;
}

interface GoldEntry {
  id: number;
  grams: number;
  note: string | null;
  created_at: string;
}

interface LoanEntry {
  id: number;
  borrower_name: string;
  amount: number;
  currency: string;
  is_returned: number;
  created_at: string;
}

export default function VaultPage() {
  const [cash, setCash] = useState<CashEntry[]>([]);
  const [gold, setGold] = useState<GoldEntry[]>([]);
  const [loans, setLoans] = useState<LoanEntry[]>([]);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);
  const [goldPriceUpdatedAt, setGoldPriceUpdatedAt] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  const fetchAll = useCallback(async () => {
    const [cashRes, goldRes, loansRes, priceRes] = await Promise.all([
      fetch('/api/cash'),
      fetch('/api/gold'),
      fetch('/api/loans'),
      fetch('/api/gold-price'),
    ]);

    setCash(await cashRes.json());
    setGold(await goldRes.json());
    setLoans(await loansRes.json());

    const priceData = await priceRes.json();
    if (priceData.price_per_gram) {
      setGoldPrice(priceData.price_per_gram);
      setGoldPriceUpdatedAt(priceData.updated_at);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const totalCash = cash.reduce((sum, e) => sum + e.amount, 0);
  const totalGrams = gold.reduce((sum, e) => sum + e.grams, 0);
  const totalGoldValue = goldPrice ? totalGrams * goldPrice : 0;
  const totalLoans = loans.filter((l) => !l.is_returned).reduce((sum, e) => sum + e.amount, 0);

  if (!loaded) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-zinc-600">Loading vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <VaultSummary
        totalCash={totalCash}
        totalGoldValue={totalGoldValue}
        totalLoans={totalLoans}
        goldPricePerGram={goldPrice}
        totalGrams={totalGrams}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <CashSection entries={cash} onRefresh={fetchAll} />
        <GoldSection
          entries={gold}
          pricePerGram={goldPrice}
          priceUpdatedAt={goldPriceUpdatedAt}
          onRefresh={fetchAll}
        />
      </div>

      <LoanSection entries={loans} onRefresh={fetchAll} />
    </div>
  );
}
