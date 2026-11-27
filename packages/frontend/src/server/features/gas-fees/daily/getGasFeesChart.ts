import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS, gasTokenOf } from '../chains'
import { eachDay, toDayRange } from '../days'
import { sum } from '../math'
import { hasPriorityFees } from './feeRules'
import { type GasFeesDay, getGasFeesDays } from './getGasFeesDays'
import {
  avgFee,
  GAS_FEES_METRICS,
  type GasFeesMetric,
  getDayValues,
  isGasMetric,
} from './metrics'

export const GasFeesChartParams = v.object({
  range: ChartRange,
  metric: v.enum(GAS_FEES_METRICS),
})
export type GasFeesChartParams = v.infer<typeof GasFeesChartParams>

/** A timestamp, then a value per chain in GAS_FEES_CHAINS order, then the L2s combined */
type GasFeesChartRow = [number, ...(number | null)[]]

export interface GasFeesChartData {
  /** Whether a point is the average of the 7 days up to it */
  weekly: boolean
  rows: GasFeesChartRow[]
}

/** Up to this many days, one point a day */
const DAILY_POINTS_UNTIL = 120
const WEEK = 7
/** Of a week's days, at least this many need a value for its average */
const MIN_DAYS_IN_WEEK = 4

export async function getGasFeesChart({
  range,
  metric,
}: GasFeesChartParams): Promise<GasFeesChartData> {
  const [from, to] = toDayRange(range)
  return toChartData(await getGasFeesDays(from, to), metric, from)
}

export function toChartData(
  days: GasFeesDay[],
  metric: GasFeesMetric,
  from: UnixTime,
): GasFeesChartData {
  const last = days.at(-1)?.timestamp
  if (last === undefined) return { weekly: false, rows: [] }
  const byDay = Map.groupBy(days, (d) => d.timestamp)
  const dates = eachDay(from, last)
  const daily = dates.map((ts) => dayColumns(byDay.get(ts) ?? [], metric))
  if (dates.length <= DAILY_POINTS_UNTIL) {
    return {
      weekly: false,
      rows: dates.map((ts, i) => [
        ts,
        ...(daily[i] ?? []).map((c) => round(c.value)),
      ]),
    }
  }
  const columnCount = GAS_FEES_CHAINS.length + 1
  const rows = dates.flatMap((ts, i): GasFeesChartRow[] => {
    const weekEnd = (dates.length - 1 - i) % WEEK === 0
    if (!weekEnd && !isFirstOfMonth(ts)) return []
    const week = daily.slice(Math.max(0, i - WEEK + 1), i + 1)
    const averages = Array.from({ length: columnCount }, (_, column) =>
      weekAverage(week.flatMap((d) => d[column] ?? [])),
    )
    return [[ts, ...averages.map(round)]]
  })
  return { weekly: true, rows }
}

interface DayColumn {
  value: number | null
  /** What the day weighs in its week's average */
  weight: number
}

function weekAverage(days: DayColumn[]): number | null {
  const valued = days.flatMap((d) =>
    d.value === null ? [] : [{ value: d.value, weight: d.weight }],
  )
  if (valued.length < MIN_DAYS_IN_WEEK) return null
  const weight = sum(valued.map((d) => d.weight))
  return weight > 0 ? sum(valued.map((d) => d.value * d.weight)) / weight : null
}

function dayColumns(days: GasFeesDay[], metric: GasFeesMetric): DayColumn[] {
  const perGas = isGasMetric(metric)
  const values = new Map(
    days
      // A price per gas in another token can't sit on an ETH axis
      .filter((d) => !perGas || gasTokenOf(d.chain) === 'ETH')
      .map((d) => [d.chain, getDayValues(d)[metric]]),
  )
  const l2Days = days.filter((d) => d.chain !== 'ethereum')
  // A week's average fee is its fees over its transactions, not the mean of its days'
  const weightOf = (chainDays: GasFeesDay[]) =>
    metric === 'avgFee' ? sum(chainDays.map((d) => d.txCount)) : 1
  return [
    ...GAS_FEES_CHAINS.map((chain) => ({
      value: values.get(chain) ?? null,
      weight: weightOf(days.filter((d) => d.chain === chain)),
    })),
    { value: combineL2s(l2Days, metric, values), weight: weightOf(l2Days) },
  ]
}

function combineL2s(
  l2Days: GasFeesDay[],
  metric: GasFeesMetric,
  values: Map<string, number | null>,
): number | null {
  if (metric === 'medianFee') return null
  if (metric === 'avgFee') return avgFee(l2Days)
  // Per gas: weighted by gas, over the ETH-priced chains only; per action: by transactions
  const perGas = isGasMetric(metric)
  const weightOf = (d: GasFeesDay) => (perGas ? d.gasUsed : d.txCount)
  let weighted = 0
  let weights = 0
  for (const d of l2Days) {
    if (perGas && gasTokenOf(d.chain) !== 'ETH') continue
    // The gas of a chain without priority fees paid none
    const paysNoTips = metric === 'priorityFee' && !hasPriorityFees(d.chain)
    const value = paysNoTips ? 0 : (values.get(d.chain) ?? null)
    if (value === null) continue
    weighted += value * weightOf(d)
    weights += weightOf(d)
  }
  return weights > 0 ? weighted / weights : null
}

function isFirstOfMonth(ts: UnixTime) {
  return UnixTime.toDate(ts).getUTCDate() === 1
}

function round(value: number | null): number | null {
  return value === null ? null : Number(value.toPrecision(3))
}
