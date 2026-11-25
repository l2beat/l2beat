import { UnixTime } from '@l2beat/shared-pure'
import type { ChartRange } from '~/utils/range/range'
import type { GasFeesRecord } from './types'

export interface GasFeesTotals {
  days: number
  txCount: number
  totalFees: number
  baseFees: number
  /** null on chains without priority fees */
  priorityFees: number | null
  l1DataFees: number
  /** Prices are null when no day in the span had transactions */
  avgFee: number | null
  medianFee: number | null
  transfer: number | null
  erc20: number | null
  swap: number | null
}

export function inRange<T extends { timestamp: number }>(
  records: T[],
  [from, to]: ChartRange,
) {
  const start = from === null ? null : UnixTime.toStartOf(from, 'day')
  return records.filter(
    (r) => (start === null || r.timestamp >= start) && r.timestamp < to,
  )
}

/**
 * Totals are sums, the average fee is fees over transactions, the median is
 * weighted by transactions like the average so it can't exceed it over a long
 * span, and action costs are plain means of the days that have one.
 */
export function summarize(records: GasFeesRecord[]): GasFeesTotals | undefined {
  if (records.length === 0) return undefined
  let txCount = 0
  let totalFees = 0
  let baseFees = 0
  let priorityFees: number | null = null
  let l1DataFees = 0
  let medianWeighted = 0
  let medianTxCount = 0
  for (const r of records) {
    txCount += r.txCount
    totalFees += r.totalFees
    baseFees += r.baseFees
    l1DataFees += r.l1DataFees
    if (r.priorityFees !== null) {
      priorityFees = (priorityFees ?? 0) + r.priorityFees
    }
    if (r.medianFee !== null) {
      medianWeighted += r.medianFee * r.txCount
      medianTxCount += r.txCount
    }
  }
  return {
    days: records.length,
    txCount,
    totalFees,
    baseFees,
    priorityFees,
    l1DataFees,
    avgFee: txCount > 0 ? totalFees / txCount : null,
    medianFee: medianTxCount > 0 ? medianWeighted / medianTxCount : null,
    transfer: mean(records.map((r) => r.transfer)),
    erc20: mean(records.map((r) => r.erc20)),
    swap: mean(records.map((r) => r.swap)),
  }
}

/** Of the values there are: a day without one is left out, not counted as zero */
export function mean(values: (number | null)[]) {
  const present = values.filter((value) => value !== null)
  return present.length === 0
    ? null
    : present.reduce((sum, value) => sum + value, 0) / present.length
}

export function median(values: number[]) {
  return quantile(values, 0.5)
}

/** Linear between the two nearest values */
function quantile(values: number[], q: number) {
  if (values.length === 0) return undefined
  const sorted = [...values].sort((a, b) => a - b)
  const at = (sorted.length - 1) * q
  const lo = sorted[Math.floor(at)] ?? 0
  const hi = sorted[Math.ceil(at)] ?? 0
  return lo + (hi - lo) * (at - Math.floor(at))
}
