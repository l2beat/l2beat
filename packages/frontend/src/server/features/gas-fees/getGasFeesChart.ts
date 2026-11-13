import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { ChartRange } from '~/utils/range/range'
import { GAS_FEES_CHAINS } from './chains'
import { getMockGasFees } from './mock/getMockGasFees'
import { inRange } from './summarize'
import { GasFeesMetric, type GasFeesRecord, isGasMetric } from './types'

export const GasFeesChartParams = v.object({
  range: ChartRange,
  metric: GasFeesMetric,
})
export type GasFeesChartParams = v.infer<typeof GasFeesChartParams>

/** Beyond this, daily values are noise at chart width, so lines show a 7-day average */
const SMOOTHING_THRESHOLD_DAYS = 120
const SMOOTHING_WINDOW_DAYS = 7

export interface GasFeesChartData {
  /**
   * A timestamp, then one value per GAS_FEES_CHAINS entry, null before
   * launch, then the L2s combined
   */
  chart: [timestamp: number, ...values: (number | null)[]][]
  smoothed: boolean
}

export function getGasFeesChart({
  range,
  metric,
}: GasFeesChartParams): GasFeesChartData {
  // A Dune snapshot until fees are tracked: see getMockGasFees
  const data = getMockGasFees()
  const ethereum = data.get('ethereum') ?? []
  const days = inRange(ethereum, range).map((r) => r.timestamp)
  const spanDays =
    days.length > 0
      ? ((days[days.length - 1] ?? 0) - (days[0] ?? 0)) / UnixTime.DAY
      : 0
  const smoothed = spanDays > SMOOTHING_THRESHOLD_DAYS

  const series = GAS_FEES_CHAINS.map((chain) =>
    // Gwei of different tokens don't share an axis
    isGasMetric(metric) && chain.gasToken !== 'ETH'
      ? []
      : (data.get(chain.id) ?? []),
  )
  series.push(combine(data))
  const byChain = series.map((records) => {
    const values = smoothed
      ? trailingAverage(records, metric)
      : records.map((r) => dailyValue(r, metric))
    return new Map(records.map((r, i) => [r.timestamp, values[i] ?? null]))
  })

  // A 7-day average needs one point a week. The 1st of each month stays, as
  // the x-axis ticks land there.
  const lastDay = days[days.length - 1] ?? 0
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
      ...byChain.map((values) => round(values.get(timestamp))),
    ]),
    smoothed,
  }
}

/**
 * Every L2 as one chain: fees and transactions add up, other fees are
 * averaged over transactions, and gas prices over gas, from chains priced in
 * ETH only
 */
function combine(data: Map<string, GasFeesRecord[]>): GasFeesRecord[] {
  const ethPriced = new Set<string>(
    GAS_FEES_CHAINS.filter((c) => c.gasToken === 'ETH').map((c) => c.id),
  )
  const days = new Map<number, (GasFeesRecord & { id: string })[]>()
  for (const [id, records] of data) {
    if (id === 'ethereum') continue
    for (const r of records) {
      days.set(r.timestamp, [...(days.get(r.timestamp) ?? []), { ...r, id }])
    }
  }
  return [...days]
    .sort(([a], [b]) => a - b)
    .map(([timestamp, records]) => {
      const txCount = records.reduce((sum, r) => sum + r.txCount, 0)
      const perTx = (key: 'medianFee' | 'transfer' | 'erc20' | 'swap') =>
        records.reduce((sum, r) => sum + r[key] * r.txCount, 0) / txCount
      // Fees over gas. Gas is execution fees over the gas price; the ETH
      // price would scale every chain the same, so it cancels out.
      let gas = 0
      let execution = 0
      let base = 0
      let priority = 0
      for (const r of records) {
        if (!ethPriced.has(r.id) || r.gasPrice <= 0) continue
        const fees = r.totalFees - r.l1DataFees
        gas += fees / r.gasPrice
        execution += fees
        base += r.baseFees ?? 0
        priority += r.priorityFees ?? 0
      }
      return {
        timestamp,
        txCount,
        totalFees: records.reduce((sum, r) => sum + r.totalFees, 0),
        baseFees: null,
        priorityFees: null,
        l1DataFees: records.reduce((sum, r) => sum + r.l1DataFees, 0),
        medianFee: perTx('medianFee'),
        transfer: perTx('transfer'),
        erc20: perTx('erc20'),
        swap: perTx('swap'),
        gasPrice: gas > 0 ? execution / gas : 0,
        baseFeePerGas: gas > 0 ? base / gas : null,
        priorityFeePerGas: gas > 0 ? priority / gas : null,
      }
    })
}

/** Three significant digits are all a chart shows, and keep the payload small */
function round(value: number | null | undefined) {
  return value === undefined || value === null
    ? null
    : Number(value.toPrecision(3))
}

function trailingAverage(records: GasFeesRecord[], metric: GasFeesMetric) {
  return records.map((_, i) => {
    const window = records.slice(
      Math.max(0, i - SMOOTHING_WINDOW_DAYS + 1),
      i + 1,
    )
    if (metric === 'avgFee') {
      const fees = window.reduce((sum, r) => sum + r.totalFees, 0)
      const txs = window.reduce((sum, r) => sum + r.txCount, 0)
      return fees / txs
    }
    const values = window
      .map((r) => dailyValue(r, metric))
      .filter((v) => v !== null)
    return values.length === 0
      ? null
      : values.reduce((sum, v) => sum + v, 0) / values.length
  })
}

function dailyValue(record: GasFeesRecord, metric: GasFeesMetric) {
  return metric === 'avgFee'
    ? record.totalFees / record.txCount
    : record[metric]
}
