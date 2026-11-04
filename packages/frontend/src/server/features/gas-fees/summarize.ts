import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'
import type { GasFeesRecord, GasFeesUsdMetric } from './types'

export interface GasFeesTotals {
  days: number
  txCount: number
  totalFees: number
  /** null when no day in the span has a base/priority split */
  baseFees: number | null
  priorityFees: number | null
  l1DataFees: number
  /** Fees from days without a split (Ethereum before London) */
  unsplitFees: number
  /** Transactions on days with a split, for base and priority fees per tx */
  splitTxCount: number
  avgFee: number
  medianFee: number
  transfer: number
  erc20: number
  swap: number
  /** Gwei per gas, means of the daily values; null without a split */
  gasPrice: number
  baseFeePerGas: number | null
  priorityFeePerGas: number | null
}

export function inRange(records: GasFeesRecord[], [from, to]: ChartRange) {
  const start = from === null ? null : UnixTime.toStartOf(from, 'day')
  return records.filter(
    (r) => (start === null || r.timestamp >= start) && r.timestamp < to,
  )
}

/**
 * Totals are sums, the average fee is fees over transactions, the median is
 * weighted by transactions like the average so it can't exceed it over a long
 * span, and action costs are plain means of the daily values.
 */
export function summarize(records: GasFeesRecord[]): GasFeesTotals | undefined {
  if (records.length === 0) return undefined
  let txCount = 0
  let totalFees = 0
  let baseFees: number | null = null
  let priorityFees: number | null = null
  let l1DataFees = 0
  let unsplitFees = 0
  let splitTxCount = 0
  let medianWeighted = 0
  let transfer = 0
  let erc20 = 0
  let swap = 0
  let gasPrice = 0
  const basePerGas: number[] = []
  const priorityPerGas: number[] = []
  for (const r of records) {
    gasPrice += r.gasPrice
    if (r.baseFeePerGas !== null) basePerGas.push(r.baseFeePerGas)
    if (r.priorityFeePerGas !== null) priorityPerGas.push(r.priorityFeePerGas)
    txCount += r.txCount
    totalFees += r.totalFees
    l1DataFees += r.l1DataFees
    if (r.baseFees === null) {
      unsplitFees += r.totalFees
    } else {
      baseFees = (baseFees ?? 0) + r.baseFees
      splitTxCount += r.txCount
      if (r.priorityFees !== null) {
        priorityFees = (priorityFees ?? 0) + r.priorityFees
      }
    }
    medianWeighted += r.medianFee * r.txCount
    transfer += r.transfer
    erc20 += r.erc20
    swap += r.swap
  }
  const n = records.length
  return {
    days: n,
    txCount,
    totalFees,
    baseFees,
    priorityFees,
    l1DataFees,
    unsplitFees,
    splitTxCount,
    avgFee: totalFees / txCount,
    medianFee: medianWeighted / txCount,
    transfer: transfer / n,
    erc20: erc20 / n,
    swap: swap / n,
    gasPrice: gasPrice / n,
    baseFeePerGas: mean(basePerGas),
    priorityFeePerGas: mean(priorityPerGas),
  }
}

function mean(values: number[]) {
  return values.length === 0
    ? null
    : values.reduce((sum, v) => sum + v, 0) / values.length
}

export function getMetricValue(
  totals: GasFeesTotals,
  metric: GasFeesUsdMetric,
) {
  return totals[metric]
}

export function median(values: number[]) {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? sorted[mid]
    : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2
}
