import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'
import type { GasFeesMetric, GasFeesRecord } from './types'

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
  avgFee: number
  medianFee: number
  transfer: number
  erc20: number
  swap: number
  nftMint: number
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
  let medianWeighted = 0
  let transfer = 0
  let erc20 = 0
  let swap = 0
  let nftMint = 0
  for (const r of records) {
    txCount += r.txCount
    totalFees += r.totalFees
    l1DataFees += r.l1DataFees
    if (r.baseFees === null) {
      unsplitFees += r.totalFees
    } else {
      baseFees = (baseFees ?? 0) + r.baseFees
      if (r.priorityFees !== null) {
        priorityFees = (priorityFees ?? 0) + r.priorityFees
      }
    }
    medianWeighted += r.medianFee * r.txCount
    transfer += r.transfer
    erc20 += r.erc20
    swap += r.swap
    nftMint += r.nftMint
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
    avgFee: totalFees / txCount,
    medianFee: medianWeighted / txCount,
    transfer: transfer / n,
    erc20: erc20 / n,
    swap: swap / n,
    nftMint: nftMint / n,
  }
}

export function getMetricValue(totals: GasFeesTotals, metric: GasFeesMetric) {
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
