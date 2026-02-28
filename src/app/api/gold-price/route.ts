import { NextResponse } from 'next/server';

let cachedPrice: { price: number; timestamp: number } | null = null;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function GET() {
  // Return cached price if fresh
  if (cachedPrice && Date.now() - cachedPrice.timestamp < CACHE_DURATION) {
    return NextResponse.json({
      price_per_gram: cachedPrice.price,
      cached: true,
      updated_at: new Date(cachedPrice.timestamp).toISOString(),
    });
  }

  try {
    // Using frankfurter + gold conversion approach
    // Gold price from a free metals API
    const res = await fetch(
      'https://data-asg.goldprice.org/dbXRates/USD',
      { next: { revalidate: 900 } }
    );

    if (!res.ok) throw new Error('Failed to fetch gold price');

    const data = await res.json();
    // data.items[0].xauPrice is price per troy ounce
    const pricePerOunce = data.items?.[0]?.xauPrice;
    if (!pricePerOunce) throw new Error('Invalid response format');

    // 1 troy ounce = 31.1035 grams
    const pricePerGram = pricePerOunce / 31.1035;

    cachedPrice = { price: pricePerGram, timestamp: Date.now() };

    return NextResponse.json({
      price_per_gram: pricePerGram,
      price_per_ounce: pricePerOunce,
      cached: false,
      updated_at: new Date().toISOString(),
    });
  } catch {
    // If we have a stale cache, return it
    if (cachedPrice) {
      return NextResponse.json({
        price_per_gram: cachedPrice.price,
        cached: true,
        stale: true,
        updated_at: new Date(cachedPrice.timestamp).toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Unable to fetch gold price. Enter manually.', price_per_gram: null },
      { status: 503 }
    );
  }
}
