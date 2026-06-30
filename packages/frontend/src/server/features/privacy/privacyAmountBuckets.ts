export interface PrivacyAmountBucket {
  key: string
  label: string
  /** Inclusive lower bound in USD. */
  minUsd: number
  /** Exclusive upper bound in USD, or null for the open-ended top bucket. */
  maxUsd: number | null
}

// Bucket boundaries double each step for even log-spacing. The first cutoff is
// $128; the last finite cutoff is 2^23 ($8,388,608, ~$10M), above which all
// addresses fall into the open-ended top bucket.
const FIRST_CUTOFF = 128
const LAST_CUTOFF = 8_388_608

function trimDecimal(value: number): string {
  return Number(value.toFixed(1)).toString()
}

/** Compact USD label, e.g. 512 -> "$512", 1024 -> "$1K", 8388608 -> "$8.4M". */
export function compactUsd(value: number): string {
  if (value < 1_000) return `$${value}`
  if (value < 1_000_000) return `$${trimDecimal(value / 1_000)}K`
  return `$${trimDecimal(value / 1_000_000)}M`
}

function buildPrivacyAmountBuckets(): PrivacyAmountBucket[] {
  const buckets: PrivacyAmountBucket[] = [
    // Everything below the smallest cutoff.
    {
      key: 'b0',
      label: `Under ${compactUsd(FIRST_CUTOFF)}`,
      minUsd: 0,
      maxUsd: FIRST_CUTOFF,
    },
  ]

  // Doubling buckets [cutoff, cutoff * 2) up to the last finite cutoff.
  for (let lower = FIRST_CUTOFF; lower < LAST_CUTOFF; lower *= 2) {
    const upper = lower * 2
    buckets.push({
      key: `b${lower}`,
      label: `${compactUsd(lower)}-${compactUsd(upper)}`,
      minUsd: lower,
      maxUsd: upper,
    })
  }

  // Open-ended top bucket.
  buckets.push({
    key: `b${LAST_CUTOFF}`,
    label: `Over ${compactUsd(LAST_CUTOFF)}`,
    minUsd: LAST_CUTOFF,
    maxUsd: null,
  })

  return buckets
}

/**
 * Log-spaced USD distribution buckets (boundaries double each step). Boundaries
 * are [minUsd, maxUsd) — inclusive lower, exclusive upper.
 */
export const PRIVACY_AMOUNT_BUCKETS: PrivacyAmountBucket[] =
  buildPrivacyAmountBuckets()

/**
 * Returns the bucket a USD value falls into, or `undefined` for negative
 * values. Boundaries are inclusive of `minUsd` and exclusive of `maxUsd`.
 */
export function getPrivacyAmountBucket(
  totalUsd: number,
): PrivacyAmountBucket | undefined {
  if (totalUsd < 0) return undefined
  return PRIVACY_AMOUNT_BUCKETS.find(
    (bucket) =>
      totalUsd >= bucket.minUsd &&
      (bucket.maxUsd === null || totalUsd < bucket.maxUsd),
  )
}
