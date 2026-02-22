export type DataPoint = { month: string; value: number }

// Xorshift PRNG seeded from a string - stable across renders for the same seed.
function makeRand(seed: string): () => number {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 16777619)
  }
  let s = (h >>> 0) || 1
  return () => {
    s ^= s << 13
    s ^= s >> 17
    s ^= s << 5
    return (s >>> 0) / 0x100000000
  }
}

function monthLabels(n: number): string[] {
  const out: string[] = []
  const now = new Date()
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push(d.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' }))
  }
  return out
}

/** Monotonically growing series (e.g. cumulative owners, plays). */
export function growingSeries(seed: string, months = 18, rate = 10): DataPoint[] {
  const rand = makeRand(seed)
  let v = rand() * rate
  return monthLabels(months).map((month) => {
    v += rand() * rate
    return { month, value: Math.round(v) }
  })
}

/** Fluctuating series bounded to [min, max] (e.g. ratings). */
export function fluctSeries(
  seed: string,
  months = 18,
  base: number,
  spread: number,
  min: number,
  max: number,
): DataPoint[] {
  const rand = makeRand(seed)
  let v = base + (rand() - 0.5) * spread
  return monthLabels(months).map((month) => {
    v += (rand() - 0.48) * spread * 0.4
    v = Math.max(min, Math.min(max, v))
    return { month, value: +v.toFixed(1) }
  })
}

/** Per-item ratings for a bar chart, one value per label. */
export function barRatings(seed: string, labels: string[]): DataPoint[] {
  const rand = makeRand(seed)
  return labels.map((month) => ({
    month,
    value: +(4 + rand() * 6).toFixed(1),
  }))
}
