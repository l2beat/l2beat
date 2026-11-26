import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS } from './chains'
import {
  type GasFeesRecords,
  getGasFeesRecords,
  getRangeDays,
} from './getGasFeesRecords'
import { mean } from './summarize'
import { GasFeesMetric, type GasFeesRecord, isGasMetric } from './types'

export const GasFeesChartParams = v.object({
  range: ChartRange,
  metric: GasFeesMetric,
})
export type GasFeesChartParams = v.infer<typeof GasFeesChartParams>

/** Beyond this, daily values are noise at chart width, so lines show a 7-day average */
const SMOOTHING_THRESHOLD_DAYS = 120
const SMOOTHING_WINDOW_DAYS = 7
/** A point needs most of its week: fewer days would pass for a week's average */
const SMOOTHING_MIN_DAYS = 4

export interface GasFeesChartData {
  /**
   * A timestamp, then one value per GAS_FEES_CHAINS entry, then the L2s
   * combined. null where the chain has no data for the day, or no
   * transactions to price.
   */
  chart: [timestamp: number, ...values: (number | null)[]][]
  smoothed: boolean
}

export async function getGasFeesChart(
  params: GasFeesChartParams,
): Promise<GasFeesChartData> {
  return buildGasFeesChart(await getGasFeesRecords(), params)
}

export function buildGasFeesChart(
  records: GasFeesRecords,
  { range, metric }: GasFeesChartParams,
): GasFeesChartData {
  const days = getRangeDays(records, range)
  const smoothed = days.length > SMOOTHING_THRESHOLD_DAYS

  const series = GAS_FEES_CHAINS.map((chain) =>
    // Gwei of different tokens don't share an axis
    isGasMetric(metric) && chain.gasToken !== 'ETH'
      ? []
      : (records.get(chain.id) ?? []),
  )
  series.push(combineL2s(records))
  const byChain = series.map((chain) => {
    const byDay = new Map(chain.map((r) => [r.timestamp, r]))
    return (day: number) =>
      smoothed
        ? trailingAverage(byDay, day, metric)
        : dailyValue(byDay.get(day), metric)
  })

  // A 7-day average needs one point a week. The 1st of each month stays, as
  // the x-axis ticks land there.
  const lastDay = days.at(-1) ?? 0
  const shown = smoothed
    ? days.filter(
        (t) =>
          ((lastDay - t) / UnixTime.DAY) % SMOOTHING_WINDOW_DAYS === 0 ||
          UnixTime.toDate(t).getUTCDate() === 1,
      )
    : days

  return {
    chart: shown.map((timestamp) => [
      timestamp,
      ...byChain.map((valueAt) => round(valueAt(timestamp))),
    ]),
    smoothed,
  }
}

/**
 * Every L2 as one chain, from those with data for the day: fees and
 * transactions add up, other fees are averaged over transactions, and gas
 * prices over gas, from chains priced in ETH only
 */
function combineL2s(records: GasFeesRecords): GasFeesRecord[] {
  const ethPriced = new Set<string>(
    GAS_FEES_CHAINS.filter((c) => c.gasToken === 'ETH').map((c) => c.id),
  )
  const days = new Map<number, (GasFeesRecord & { id: string })[]>()
  for (const [id, chain] of records) {
    if (id === 'ethereum') continue
    for (const r of chain) {
      days.set(r.timestamp, [...(days.get(r.timestamp) ?? []), { ...r, id }])
    }
  }
  return [...days]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, chains]) => {
      const sum = (key: 'txCount' | 'totalFees' | 'baseFees' | 'l1DataFees') =>
        chains.reduce((total, r) => total + r[key], 0)
      const perTx = (key: 'transfer' | 'erc20' | 'swap') =>
        weightedMean(chains, key, 'txCount')
      const inEth = chains.filter((r) => ethPriced.has(r.id))
      return {
        timestamp,
        txCount: sum('txCount'),
        gasUsed: inEth.reduce((total, r) => total + r.gasUsed, 0),
        totalFees: sum('totalFees'),
        baseFees: sum('baseFees'),
        priorityFees: null,
        l1DataFees: sum('l1DataFees'),
        // Chains' medians don't make a median of all their transactions
        medianFee: null,
        transfer: perTx('transfer'),
        erc20: perTx('erc20'),
        swap: perTx('swap'),
        gasPrice: weightedMean(inEth, 'gasPrice', 'gasUsed'),
        baseFeePerGas: weightedMean(inEth, 'baseFeePerGas', 'gasUsed'),
        priorityFeePerGas: weightedMean(inEth, 'priorityFeePerGas', 'gasUsed'),
      }
    })
}

/** Over the records that have the value */
function weightedMean(
  records: GasFeesRecord[],
  key: Exclude<GasFeesMetric, 'avgFee'>,
  weight: 'txCount' | 'gasUsed',
) {
  let total = 0
  let weights = 0
  for (const r of records) {
    const value = r[key]
    if (value === null) continue
    total += value * r[weight]
    weights += r[weight]
  }
  return weights > 0 ? total / weights : null
}

/** Three significant digits are all a chart shows, and keep the payload small */
function round(value: number | null) {
  return value === null ? null : Number(value.toPrecision(3))
}

/**
 * Over the days of the 7 ending at `day` that have a value. null when most of
 * them have none, missing or without transactions, so a gap stays a gap. A
 * shorter gap can't show at a point a week.
 */
function trailingAverage(
  byDay: Map<number, GasFeesRecord>,
  day: number,
  metric: GasFeesMetric,
) {
  const priced: GasFeesRecord[] = []
  for (let i = 0; i < SMOOTHING_WINDOW_DAYS; i++) {
    const record = byDay.get(day - i * UnixTime.DAY)
    if (record && dailyValue(record, metric) !== null) priced.push(record)
  }
  if (priced.length < SMOOTHING_MIN_DAYS) return null
  if (metric === 'avgFee') {
    const fees = priced.reduce((sum, r) => sum + r.totalFees, 0)
    const txs = priced.reduce((sum, r) => sum + r.txCount, 0)
    return fees / txs
  }
  return mean(priced.map((r) => r[metric]))
}

function dailyValue(record: GasFeesRecord | undefined, metric: GasFeesMetric) {
  if (!record) return null
  if (metric !== 'avgFee') return record[metric]
  return record.txCount > 0 ? record.totalFees / record.txCount : null
}
