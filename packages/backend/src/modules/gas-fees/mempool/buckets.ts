import type { GasFeesWaitBucket } from '@l2beat/database'

export interface TipLevel {
  fromWei: number
  toWei: number
}

/**
 * The price of speed's tip levels, METHODOLOGY.md: 30 per tenfold step from
 * 0.01 to 0.1 gwei, then every 0.05 gwei up to the 2 gwei level, 2 to 2.05.
 * Bounds in whole wei, so a round tip falls in one level exactly.
 */
export const TIP_LEVELS: TipLevel[] = (() => {
  const bounds: number[] = []
  for (let k = 0; k < 30; k++) bounds.push(Math.round(1e7 * 10 ** (k / 30)))
  for (let k = 0; k <= 39; k++) bounds.push(1e8 + k * 5e7)
  return bounds
    .slice(0, -1)
    .map((fromWei, i) => ({ fromWei, toWei: bounds[i + 1] ?? fromWei }))
})()

const BUCKET_MS = 500
/** 500 ms buckets up to this, then the coarser ones below */
const FINE_BUCKETS_UNTIL_MS = 120_000
const COARSE_BUCKET_STARTS_MS = [120_000, 300_000, 600_000, 1_800_000]

/** The query's wait bucket numbers: 0 to 239 are 500 ms wide, 240 to 243 the coarse ones */
export function toWaitBucket(bucket: number): GasFeesWaitBucket {
  const fine = FINE_BUCKETS_UNTIL_MS / BUCKET_MS
  if (bucket < fine) {
    return {
      waitFromMs: bucket * BUCKET_MS,
      waitToMs: (bucket + 1) * BUCKET_MS,
    }
  }
  const index = bucket - fine
  const waitFromMs = COARSE_BUCKET_STARTS_MS[index]
  if (waitFromMs === undefined) {
    throw new Error('Unknown wait bucket', { cause: { bucket } })
  }
  return { waitFromMs, waitToMs: COARSE_BUCKET_STARTS_MS[index + 1] ?? null }
}
