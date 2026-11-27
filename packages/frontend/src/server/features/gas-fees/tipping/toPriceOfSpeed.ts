import type {
  GasFeesTierWaitTotal,
  GasFeesTipHourlyRecord,
  GasFeesTipLevelWaitTotal,
  GasFeesWaitBucket,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { tipToUsd } from '../chains'
import { type DayPeriod, toDayPeriod } from '../days'
import { mean, sum } from '../math'

/** Of a tip level's transactions, this share landed within its wait */
const SURE_SHARE = 0.99
/** Fewer transactions than this make a level's wait noise */
const MIN_LEVEL_TXS = 1_000
const ROUND_TIPS_GWEI = [0.1, 1, 2] as const

/** One tip level: x is what its average tip adds to an ERC-20 transfer */
export interface SpeedDot {
  fromGwei: number
  toGwei: number
  txCount: number
  usd: number
  /** undefined when the 99th percentile falls in the open-ended last wait */
  seconds: number | undefined
}

export interface SpeedPoint {
  usd: number
  seconds: number
}

export interface PriceOfSpeed {
  period: DayPeriod
  /** What a gwei of tip adds to an ERC-20 transfer at the period's average ETH price */
  usdPerGwei: number
  dots: SpeedDot[]
  /** Through the dots, never rising */
  line: SpeedPoint[]
  roundTips: (SpeedPoint & { gwei: number })[]
  /** Our estimated fast tip's cost; its wait is undefined without one */
  fastTip: { usd: number; seconds: number | undefined } | undefined
}

interface PriceOfSpeedInput {
  /** Days the mempool data is complete for */
  completeDays: number[]
  levelWaits: GasFeesTipLevelWaitTotal[]
  tierWaits: GasFeesTierWaitTotal[]
  hourlyTips: GasFeesTipHourlyRecord[]
}

export function toPriceOfSpeed(
  input: PriceOfSpeedInput,
): PriceOfSpeed | undefined {
  const period = toDayPeriod(input.completeDays)
  const complete = new Set(input.completeDays)
  const hours = input.hourlyTips.filter((h) =>
    complete.has(UnixTime.toStartOf(h.timestamp, 'day')),
  )
  const ethUsd = mean(hours.map((h) => h.ethUsd))
  if (!period || ethUsd === null) return undefined
  const usdPerGwei = tipToUsd(1, ethUsd)

  const dots = toDots(input.levelWaits, usdPerGwei)
  const line = fitNonRising(
    dots.flatMap((d) =>
      d.seconds === undefined
        ? []
        : [{ usd: d.usd, seconds: d.seconds, weight: d.txCount }],
    ),
  )
  const fastTipUsd = mean(hours.map((h) => tipToUsd(h.fastTipGwei, h.ethUsd)))
  return {
    period,
    usdPerGwei,
    dots,
    line,
    roundTips: toRoundTips(line, usdPerGwei),
    fastTip:
      fastTipUsd === null
        ? undefined
        : {
            usd: fastTipUsd,
            seconds: secondsWithin(
              input.tierWaits.filter((w) => w.tier === 'fast'),
            ),
          },
  }
}

function toRoundTips(line: SpeedPoint[], usdPerGwei: number) {
  const lowest = line[0]
  if (!lowest) return []
  return ROUND_TIPS_GWEI.flatMap((gwei) => {
    const usd = gwei * usdPerGwei
    // A tip under every level with a wait may wait longer than any of them
    if (usd < lowest.usd) return []
    return [{ gwei, usd, seconds: valueOnLine(line, usd) }]
  })
}

function toDots(
  waits: GasFeesTipLevelWaitTotal[],
  usdPerGwei: number,
): SpeedDot[] {
  const levels = Map.groupBy(waits, (w) => w.tipFromWei)
  return [...levels.values()].flatMap((buckets) => {
    const first = buckets[0]
    const txCount = sum(buckets.map((b) => b.txCount))
    if (!first || txCount < MIN_LEVEL_TXS) return []
    const avgTipGwei = sum(buckets.map((b) => b.tipSumGwei)) / txCount
    return [
      {
        fromGwei: first.tipFromWei / 1e9,
        toGwei: first.tipToWei / 1e9,
        txCount,
        usd: avgTipGwei * usdPerGwei,
        seconds: secondsWithin(buckets),
      },
    ]
  })
}

/** The wait SURE_SHARE of the transactions landed within, interpolated inside its bucket */
export function secondsWithin(
  buckets: (GasFeesWaitBucket & { txCount: number })[],
): number | undefined {
  const sorted = [...buckets].sort((a, b) => a.waitFromMs - b.waitFromMs)
  const target = sum(sorted.map((b) => b.txCount)) * SURE_SHARE
  let before = 0
  for (const bucket of sorted) {
    if (bucket.txCount > 0 && before + bucket.txCount >= target) {
      if (bucket.waitToMs === null) return undefined
      const into = (target - before) / bucket.txCount
      const ms =
        bucket.waitFromMs + (bucket.waitToMs - bucket.waitFromMs) * into
      return Math.round(ms / 100) / 10
    }
    before += bucket.txCount
  }
  return undefined
}

/** Weighted least squares under "never rises": pools adjacent violators */
export function fitNonRising(
  points: (SpeedPoint & { weight: number })[],
): SpeedPoint[] {
  const sorted = [...points].sort((a, b) => a.usd - b.usd)
  const blocks: { value: number; weight: number; count: number }[] = []
  for (const p of sorted) {
    blocks.push({ value: p.seconds, weight: p.weight, count: 1 })
    let last = blocks.at(-1)
    let prev = blocks.at(-2)
    while (last && prev && prev.value < last.value) {
      const weight = prev.weight + last.weight
      blocks.splice(-2, 2, {
        value: (prev.value * prev.weight + last.value * last.weight) / weight,
        weight,
        count: prev.count + last.count,
      })
      last = blocks.at(-1)
      prev = blocks.at(-2)
    }
  }
  const values = blocks.flatMap((b) => Array(b.count).fill(b.value) as number[])
  return sorted.map((p, i) => ({
    usd: p.usd,
    seconds: Math.round((values[i] ?? p.seconds) * 10) / 10,
  }))
}

/** Linear between the line's points, flat past its ends */
export function valueOnLine(line: SpeedPoint[], usd: number): number {
  const next = line.findIndex((p) => p.usd >= usd)
  if (next === -1) return line.at(-1)?.seconds ?? 0
  const b = line[next]
  const a = line[next - 1]
  if (!b) return 0
  if (!a || b.usd === a.usd) return b.seconds
  return a.seconds + ((b.seconds - a.seconds) * (usd - a.usd)) / (b.usd - a.usd)
}
