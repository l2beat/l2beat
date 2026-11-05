import { UnixTime } from '@l2beat/shared-pure'
import type { GasFeesChainId } from '../chains'
import type { GasFeesRecord } from '../types'
import snapshot from './gasFeesSnapshot.json'

// A one-off pull from Dune (gas.fees and the chains' blocks) on 2026-11-04,
// until a backend tracks fees. Daily for the last five weeks, sampled weekly
// before that (monthly from Jul 2024 to Dec 2025), plus the last 24 hours.
// Days between samples are interpolated, and timestamps move forward in
// whole days so the page always ends at the latest day.

type SnapshotRow = [
  timestamp: number,
  txCount: number,
  totalFees: number,
  baseFees: number | null,
  priorityFees: number | null,
  l1DataFees: number,
  medianFee: number,
  transfer: number,
  erc20: number,
  swap: number,
  gasPrice: number,
  baseFeePerGas: number | null,
  priorityFeePerGas: number | null,
]

interface Snapshot {
  lastDay: number
  /** Starts of 24 full UTC hours, oldest first */
  hours: number[]
  chains: Partial<
    Record<
      GasFeesChainId,
      {
        daily: SnapshotRow[]
        /** null when Dune lagged too far behind for this chain */
        hourly: MockRecentChain | null
      }
    >
  >
}

const SNAPSHOT = snapshot as unknown as Snapshot

let cached: { until: number; data: Map<GasFeesChainId, GasFeesRecord[]> }

/** Daily records per chain, ending at the last full UTC day */
export function getMockGasFees(): Map<GasFeesChainId, GasFeesRecord[]> {
  const until = UnixTime.toStartOf(UnixTime.now(), 'day') - UnixTime.DAY
  if (cached?.until !== until) {
    const shift = until - SNAPSHOT.lastDay
    const data = new Map<GasFeesChainId, GasFeesRecord[]>()
    for (const [id, chain] of entries(SNAPSHOT.chains)) {
      data.set(id, fillDays(chain.daily, shift))
    }
    cached = { until, data }
  }
  return cached.data
}

export interface MockRecentGasFees {
  /** Starts of the last 24 full UTC hours, oldest first */
  hours: number[]
  chains: Map<GasFeesChainId, MockRecentChain>
}

interface MockRecentChain {
  /** Average fee per transaction in USD, per hour */
  avgFee: number[]
  /** Per gas in the chain's gas unit, per hour */
  baseFee: number[]
  /** null on chains without priority fees */
  priorityFee: number[] | null
}

export function getMockRecentGasFees(): MockRecentGasFees {
  const lastHour = SNAPSHOT.hours[SNAPSHOT.hours.length - 1] ?? 0
  const behind = UnixTime.toStartOf(UnixTime.now(), 'hour') - lastHour
  // Whole days, so each hour keeps its time of day
  const shift = Math.max(0, Math.floor(behind / UnixTime.DAY)) * UnixTime.DAY
  const chains = new Map<GasFeesChainId, MockRecentChain>()
  for (const [id, chain] of entries(SNAPSHOT.chains)) {
    if (chain.hourly) chains.set(id, chain.hourly)
  }
  return { hours: SNAPSHOT.hours.map((hour) => hour + shift), chains }
}

function fillDays(rows: SnapshotRow[], shift: number): GasFeesRecord[] {
  const records: GasFeesRecord[] = []
  rows.forEach((row, i) => {
    records.push(toRecord(row, shift))
    const next = rows[i + 1]
    if (!next) return
    for (let t = row[0] + UnixTime.DAY; t < next[0]; t += UnixTime.DAY) {
      const f = (t - row[0]) / (next[0] - row[0])
      records.push(toRecord(between(row, next, f, t), shift))
    }
  })
  return records
}

/**
 * Fees move by orders of magnitude, so amounts are interpolated
 * geometrically. Parts of a whole follow their share of it, so a day's
 * split still adds up to its total.
 */
function between(
  a: SnapshotRow,
  b: SnapshotRow,
  f: number,
  timestamp: number,
): SnapshotRow {
  const geo = (x: number, y: number) =>
    x > 0 && y > 0 ? x * (y / x) ** f : x + (y - x) * f
  const part = (
    x: number | null,
    y: number | null,
    xOf: number,
    yOf: number,
  ) =>
    x === null || y === null
      ? null
      : geo(xOf, yOf) * (x / xOf + (y / yOf - x / xOf) * f) || 0
  return [
    timestamp,
    Math.round(geo(a[1], b[1])),
    geo(a[2], b[2]),
    part(a[3], b[3], a[2], b[2]),
    part(a[4], b[4], a[2], b[2]),
    part(a[5], b[5], a[2], b[2]) ?? 0,
    geo(a[6], b[6]),
    geo(a[7], b[7]),
    geo(a[8], b[8]),
    geo(a[9], b[9]),
    geo(a[10], b[10]),
    part(a[11], b[11], a[10], b[10]),
    part(a[12], b[12], a[10], b[10]),
  ]
}

function toRecord(row: SnapshotRow, shift: number): GasFeesRecord {
  return {
    timestamp: row[0] + shift,
    txCount: row[1],
    totalFees: row[2],
    baseFees: row[3],
    priorityFees: row[4],
    l1DataFees: row[5],
    medianFee: row[6],
    transfer: row[7],
    erc20: row[8],
    swap: row[9],
    gasPrice: row[10],
    baseFeePerGas: row[11],
    priorityFeePerGas: row[12],
  }
}

function entries<K extends string, V>(record: Partial<Record<K, V>>) {
  return Object.entries(record) as [K, V][]
}
