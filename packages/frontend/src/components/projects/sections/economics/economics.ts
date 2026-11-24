import { UnixTime } from '@l2beat/shared-pure'
import type { EthSupplyDay } from '~/server/features/eth-supply/types'
import { formatMonthYear } from './format'

const DAY = UnixTime.DAY

export type EconomicsRange = '30d' | '90d' | '1y' | 'all'

export const RANGE_OPTIONS: { value: EconomicsRange; label: string }[] = [
  { value: '30d', label: '30D' },
  { value: '90d', label: '90D' },
  { value: '1y', label: '1Y' },
  { value: 'all', label: 'All' },
]

const RANGE_DAYS = { '30d': 30, '90d': 90, '1y': 365 }

export const UPGRADES = [
  { name: 'Dencun', timestamp: UnixTime.fromDate(new Date('2024-03-13')) },
  { name: 'Pectra', timestamp: UnixTime.fromDate(new Date('2025-05-07')) },
  { name: 'Fusaka', timestamp: UnixTime.fromDate(new Date('2025-12-03')) },
]

export function sliceRange(
  days: EthSupplyDay[],
  range: EconomicsRange,
): EthSupplyDay[] {
  const last = days.at(-1)
  if (range === 'all' || !last) return days
  const from = last.timestamp - (RANGE_DAYS[range] - 1) * DAY
  return days.filter((d) => d.timestamp >= from)
}

/** "past 30 days", or "since Jan 2024" for all the data. */
export function rangeLabel(range: EconomicsRange, days: EthSupplyDay[]) {
  switch (range) {
    case '30d':
      return 'past 30 days'
    case '90d':
      return 'past 90 days'
    case '1y':
      return 'past year'
    case 'all':
      return `since ${formatMonthYear(days[0]?.timestamp ?? 0)}`
  }
}

export interface WindowSummary {
  days: number
  issued: number
  burned: number
  net: number
  /** Net issuance over the supply the window started with, per year */
  annualizedRate: number
  /** Burned over issued */
  burnOffset: number
}

export function summarize(days: EthSupplyDay[]): WindowSummary {
  let issued = 0
  let burned = 0
  for (const d of days) {
    issued += d.issuance
    burned += d.burn
  }
  const net = issued - burned
  const first = days[0]
  const startSupply = first
    ? first.totalSupply - first.issuance + first.burn
    : 0
  return {
    days: days.length,
    issued,
    burned,
    net,
    annualizedRate:
      startSupply > 0 && days.length > 0
        ? (net / startSupply) * (365 / days.length)
        : 0,
    burnOffset: issued > 0 ? burned / issued : 0,
  }
}

export interface FlowRow {
  timestamp: number
  until: number
  days: number
  /** Per day */
  issuance: number
  burn: number
  net: number
}

/** Daily rows up to 120 days, weekly averages beyond, ending on the last day. */
export function getFlowRows(days: EthSupplyDay[]): FlowRow[] {
  const bucket = days.length > 120 ? 7 : 1
  const head = days.length % bucket
  const rows: FlowRow[] = []
  if (head > 0) rows.push(toFlowRow(days.slice(0, head)))
  for (let i = head; i < days.length; i += bucket) {
    rows.push(toFlowRow(days.slice(i, i + bucket)))
  }
  return rows
}

function toFlowRow(days: EthSupplyDay[]): FlowRow {
  const { issued, burned, net } = summarize(days)
  return {
    timestamp: days[0]?.timestamp ?? 0,
    until: days.at(-1)?.timestamp ?? 0,
    days: days.length,
    issuance: issued / days.length,
    burn: burned / days.length,
    net: net / days.length,
  }
}

export interface RecordDay {
  timestamp: number
  value: number
}

/** The days with the most ETH burned and issued. */
export function getRecordDays(days: EthSupplyDay[]) {
  let mostBurned: RecordDay | undefined
  let mostIssued: RecordDay | undefined
  for (const d of days) {
    if (!mostBurned || d.burn > mostBurned.value) {
      mostBurned = { timestamp: d.timestamp, value: d.burn }
    }
    if (!mostIssued || d.issuance > mostIssued.value) {
      mostIssued = { timestamp: d.timestamp, value: d.issuance }
    }
  }
  return { mostBurned, mostIssued }
}
