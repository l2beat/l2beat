import type { GasFeesWaitBucket } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { GasFeesTippingInput } from '../getGasFeesTipping'

const DAYS = 365
const BUCKET_MS = 500
const SLOT_MS = 12_000

/** A year of made-up days in the backend's shapes: a higher tip misses fewer blocks */
export function getMockTippingInput(): GasFeesTippingInput {
  const lastDay = UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.DAY
  const days = Array.from(
    { length: DAYS },
    (_, i) => lastDay - (DAYS - 1 - i) * UnixTime.DAY,
  )
  // 30 levels per tenfold step up to 0.1 gwei, then every 0.05 gwei, as the backend cuts them
  const bounds = [
    ...Array.from({ length: 30 }, (_, k) => Math.round(1e7 * 10 ** (k / 30))),
    ...Array.from({ length: 40 }, (_, k) => 1e8 + k * 5e7),
  ]
  return {
    payers: days.map((timestamp) => ({
      timestamp: UnixTime(timestamp),
      status: 'complete',
      ethUsd: 2_000,
      fastTipGwei: 0.3,
      low: { txCount: 700_000, tipEth: 1.5 * (0.5 + Math.random()) },
      middle: { txCount: 250_000, tipEth: 10 * (0.5 + Math.random()) },
      high: { txCount: 300_000, tipEth: 45 * (0.5 + Math.random()) },
      roundTipTxCount: 200_000,
      atFastTipEth: 12,
      nonOrdinary: { txCount: 90_000, tipEth: 50 },
    })),
    mempoolDays: days.map((timestamp) => ({ timestamp, complete: true })),
    tipLevelWaits: bounds.slice(0, -1).flatMap((tipFromWei, i) => {
      const tipToWei = bounds[i + 1] ?? tipFromWei
      const txCount = 50_000 + Math.round(Math.random() * 100_000)
      return getWaits(0.6 + (0.37 * i) / bounds.length, txCount).map(
        (wait) => ({
          ...wait,
          tipFromWei,
          tipToWei,
          tipSumGwei: (wait.txCount * (tipFromWei + tipToWei)) / 2e9,
        }),
      )
    }),
    tierWaits: getWaits(0.93, 500_000).map((wait) => ({
      ...wait,
      tier: 'fast',
    })),
    hourlyTips: days.flatMap((day) =>
      Array.from({ length: 24 }, (_, hour) => ({
        timestamp: day + hour * UnixTime.HOUR,
        fastTipGwei: 0.2 + Math.random() * 0.2,
        ethUsd: 2_000,
      })),
    ),
  }
}

/** Arrivals spread evenly over a slot, and each block takes the transaction with the same chance */
function getWaits(
  chancePerBlock: number,
  txCount: number,
): (GasFeesWaitBucket & { txCount: number })[] {
  const perSlot = SLOT_MS / BUCKET_MS
  return Array.from({ length: 10 * perSlot }, (_, bucket) => {
    const missed = Math.floor(bucket / perSlot)
    const share = ((1 - chancePerBlock) ** missed * chancePerBlock) / perSlot
    return {
      waitFromMs: bucket * BUCKET_MS,
      waitToMs: (bucket + 1) * BUCKET_MS,
      txCount: Math.round(txCount * share),
    }
  })
}
