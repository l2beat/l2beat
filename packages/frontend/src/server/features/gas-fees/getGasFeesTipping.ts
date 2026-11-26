import type {
  GasFeesTierWaitTotal,
  GasFeesTipLevelWaitTotal,
  GasFeesTipPayersDailyRecord,
  GasFeesWaitBucket,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getMockTippingInput } from './mock/getMockTippingInput'
import { tipToUsd } from './types'

const PERIOD_DAYS = 365
/** With fewer transactions than this, fewer than ten of them place the 99th percentile */
const SMALLEST_LEVEL = 1_000
const SURE = 0.99
/** The tips marked on the price of speed, beside our fast tip */
const MARKED_GWEI = [0.1, 1, 2]

const GROUPS = ['low', 'middle', 'high'] as const
type Group = (typeof GROUPS)[number]

/** The days a figure is from */
export interface GasFeesPeriod {
  /** Start of the first day */
  from: number
  /** Start of the last day */
  to: number
  days: number
  /** Days between the two that Dune doesn't have whole, left out of the figure */
  missingDays: number
}

/** Ordinary transactions: a tip under 2.5 gwei, not a builder's own payment */
export interface GasFeesTipPayers {
  period: GasFeesPeriod
  /** USD tipped by ordinary transactions */
  ordinaryUsd: number
  /** Of it, what they would have tipped with each tip capped at our fast tip of the day */
  atFastUsd: number
  /** Shares of ordinary transactions and of their tips, by tip: under 0.1 gwei, 0.1 to 1, 1 to 2.5 */
  txShares: Record<Group, number>
  tipShares: Record<Group, number>
}

export interface GasFeesSpeedPoint {
  /** What the tip adds to the cost of an ERC-20 transfer */
  usd: number
  /** How long until 99% of the transactions had landed */
  seconds: number
}

export interface GasFeesPriceOfSpeed {
  period: GasFeesPeriod
  /** What a tip of one gwei adds to an ERC-20 transfer, at the period's average ETH price */
  usdPerGwei: number
  /** One per tip level, at the average tip paid in it */
  dots: (GasFeesSpeedPoint & {
    fromGwei: number
    toGwei: number
    txCount: number
  })[]
  /** The best fit through the dots that never rises with the tip, weighted by their transactions */
  line: GasFeesSpeedPoint[]
  /** Round tips on the line, cheapest first */
  roundTips: (GasFeesSpeedPoint & { gwei: number })[]
  /** Our fast tip at its own average cost and wait, undefined when no transaction near it was seen */
  fastTip: GasFeesSpeedPoint | undefined
  /** Our fast tip against 2 gwei, undefined without both or when ours is the dearer one */
  fastVsTwoGwei:
    | { extraUsd: number; fastSeconds: number; twoGweiSeconds: number }
    | undefined
}

export interface GasFeesTipping {
  /** undefined until the backend has stored a whole day */
  payers: GasFeesTipPayers | undefined
  speed: GasFeesPriceOfSpeed | undefined
}

export interface GasFeesTippingInput {
  payers: GasFeesTipPayersDailyRecord[]
  /** Start of each day the mempool data is complete for */
  mempoolDays: { timestamp: number; complete: boolean }[]
  /** Summed over the complete days */
  tipLevelWaits: GasFeesTipLevelWaitTotal[]
  tierWaits: GasFeesTierWaitTotal[]
  /** Our hourly estimates */
  hourlyTips: { timestamp: number; fastTipGwei: number; ethUsd: number }[]
}

/** What ordinary transactions tipped and what a tip bought, over the past year, from the days the backend has */
export async function getGasFeesTipping(): Promise<GasFeesTipping> {
  return buildGasFeesTipping(
    env.MOCK ? getMockTippingInput() : await readTippingInput(),
  )
}

async function readTippingInput(): Promise<GasFeesTippingInput> {
  const db = getDb()
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = to - PERIOD_DAYS * UnixTime.DAY
  const [payers, mempoolDays, tipLevelWaits, tierWaits, hourlyTips] =
    await Promise.all([
      db.gasFeesTipPayersDaily.getInRange(from, to),
      db.gasFeesMempool.getDays(from, to),
      db.gasFeesMempool.getCompleteTipLevelWaitTotals(from, to),
      db.gasFeesMempool.getCompleteTierWaitTotals(from, to),
      // A day's hours end at the start of the next day
      db.gasFeesTipHourly.getInRange(from, UnixTime(to + UnixTime.DAY)),
    ])
  return {
    payers,
    mempoolDays: mempoolDays.map((day) => ({
      timestamp: day.timestamp,
      complete: day.status === 'complete',
    })),
    tipLevelWaits,
    tierWaits,
    hourlyTips,
  }
}

export function buildGasFeesTipping(
  input: GasFeesTippingInput,
): GasFeesTipping {
  return {
    payers: buildTipPayers(input.payers),
    speed: buildPriceOfSpeed(input),
  }
}

function buildTipPayers(
  days: GasFeesTipPayersDailyRecord[],
): GasFeesTipPayers | undefined {
  const complete = days.filter((day) => day.status === 'complete')
  const period = toPeriod(
    days.map((day) => ({ ...day, complete: day.status === 'complete' })),
  )
  if (!period) return undefined

  const txCount = { low: 0, middle: 0, high: 0 }
  const tipUsd = { low: 0, middle: 0, high: 0 }
  let atFastUsd = 0
  for (const day of complete) {
    for (const group of GROUPS) {
      txCount[group] += day[group].txCount
      tipUsd[group] += day[group].tipEth * day.ethUsd
    }
    atFastUsd += day.atFastTipEth * day.ethUsd
  }
  const ordinaryUsd = tipUsd.low + tipUsd.middle + tipUsd.high
  return {
    period,
    ordinaryUsd,
    atFastUsd,
    txShares: toShares(txCount),
    tipShares: toShares(tipUsd),
  }
}

function buildPriceOfSpeed(
  input: GasFeesTippingInput,
): GasFeesPriceOfSpeed | undefined {
  const period = toPeriod(input.mempoolDays)
  if (!period) return undefined
  // Our estimates and the price of ETH over the same days as the waits
  const completeDays = new Set(
    input.mempoolDays.filter((day) => day.complete).map((day) => day.timestamp),
  )
  const hours = input.hourlyTips.filter((hour) =>
    completeDays.has(UnixTime.toStartOf(UnixTime(hour.timestamp), 'day')),
  )
  if (hours.length === 0) return undefined
  const ethUsd = average(hours.map((hour) => hour.ethUsd))
  // Hour by hour: our tip is high in the hours when ETH is too
  const fastUsd = average(
    hours.map((hour) => tipToUsd(hour.fastTipGwei, hour.ethUsd)),
  )

  const levels = new Map<number, GasFeesTipLevelWaitTotal[]>()
  for (const row of input.tipLevelWaits) {
    levels.set(row.tipFromWei, [...(levels.get(row.tipFromWei) ?? []), row])
  }
  const dots = [...levels.values()]
    .flatMap((buckets) => {
      const first = buckets[0]
      const txCount = buckets.reduce((sum, b) => sum + b.txCount, 0)
      const seconds = getSureWait(buckets)
      if (!first || txCount < SMALLEST_LEVEL || seconds === undefined) return []
      const tipGwei =
        buckets.reduce((sum, b) => sum + b.tipSumGwei, 0) / txCount
      return [
        {
          fromGwei: first.tipFromWei / 1e9,
          toGwei: first.tipToWei / 1e9,
          txCount,
          usd: tipToUsd(tipGwei, ethUsd),
          seconds,
        },
      ]
    })
    .sort((a, b) => a.fromGwei - b.fromGwei)
  if (dots.length === 0) return undefined

  const fitted = fitNeverRising(dots.map((dot) => [dot.seconds, dot.txCount]))
  const line = dots.map((dot, i) => ({ usd: dot.usd, seconds: fitted[i] ?? 0 }))
  const onLine = (gwei: number) => {
    const i = dots.findIndex((dot) => gwei >= dot.fromGwei && gwei < dot.toGwei)
    return fitted[i]
  }

  const fastSeconds = getSureWait(
    input.tierWaits.filter((row) => row.tier === 'fast'),
  )
  const roundTips = MARKED_GWEI.flatMap((gwei) => {
    const seconds = onLine(gwei)
    return seconds === undefined
      ? []
      : [{ gwei, usd: tipToUsd(gwei, ethUsd), seconds }]
  })
  const twoGweiSeconds = onLine(2)
  const extraUsd = tipToUsd(2, ethUsd) - fastUsd

  return {
    period,
    usdPerGwei: tipToUsd(1, ethUsd),
    dots,
    line,
    roundTips,
    fastTip:
      fastSeconds === undefined
        ? undefined
        : { usd: fastUsd, seconds: fastSeconds },
    fastVsTwoGwei:
      fastSeconds === undefined || twoGweiSeconds === undefined || extraUsd <= 0
        ? undefined
        : { extraUsd, fastSeconds, twoGweiSeconds },
  }
}

/**
 * Seconds within which 99% of the transactions in the buckets had landed,
 * placed within its bucket by the share of it that is needed. undefined when
 * that is the last bucket, which has no end: the wait is only known to be longer.
 */
export function getSureWait(
  buckets: (GasFeesWaitBucket & { txCount: number })[],
): number | undefined {
  const sorted = [...buckets].sort((a, b) => a.waitFromMs - b.waitFromMs)
  const needed = sorted.reduce((sum, b) => sum + b.txCount, 0) * SURE
  if (needed === 0) return undefined
  let landed = 0
  for (const bucket of sorted) {
    if (landed + bucket.txCount >= needed) {
      if (bucket.waitToMs === null) return undefined
      const width = bucket.waitToMs - bucket.waitFromMs
      const within = (needed - landed) / bucket.txCount
      return round((bucket.waitFromMs + width * within) / 1000)
    }
    landed += bucket.txCount
  }
  return undefined
}

/**
 * The values closest to the given ones, by weighted squares, that never rise
 * from one to the next: neighbours that rise are replaced by their weighted
 * mean until none do (pool adjacent violators).
 */
export function fitNeverRising(points: [value: number, weight: number][]) {
  const pools: { value: number; weight: number; size: number }[] = []
  for (const [value, weight] of points) {
    pools.push({ value, weight, size: 1 })
    while (pools.length > 1) {
      const last = pools[pools.length - 1]
      const before = pools[pools.length - 2]
      if (!last || !before || before.value >= last.value) break
      const weight = before.weight + last.weight
      pools.splice(-2, 2, {
        value:
          (before.value * before.weight + last.value * last.weight) / weight,
        weight,
        size: before.size + last.size,
      })
    }
  }
  return pools.flatMap((pool) => Array(pool.size).fill(round(pool.value)))
}

function toPeriod(
  days: { timestamp: number; complete: boolean }[],
): GasFeesPeriod | undefined {
  const complete = days.filter((day) => day.complete)
  const first = complete[0]
  const last = complete.at(-1)
  if (!first || !last) return undefined
  const span = (last.timestamp - first.timestamp) / UnixTime.DAY + 1
  return {
    from: first.timestamp,
    to: last.timestamp,
    days: complete.length,
    missingDays: span - complete.length,
  }
}

function toShares(amounts: Record<Group, number>): Record<Group, number> {
  const total = amounts.low + amounts.middle + amounts.high
  const share = (amount: number) => (total > 0 ? amount / total : 0)
  return {
    low: share(amounts.low),
    middle: share(amounts.middle),
    high: share(amounts.high),
  }
}

function average(values: number[]) {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

/** Waits are stored in half-second buckets, so a tenth of a second is all they can tell */
function round(seconds: number) {
  return Math.round(seconds * 10) / 10
}
