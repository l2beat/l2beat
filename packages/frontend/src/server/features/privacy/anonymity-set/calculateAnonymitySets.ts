import type { PrivacyAnonymitySetSenderDayRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

/** Length of the rolling distinct-depositor window, in UTC days. */
export const ANONYMITY_SET_WINDOW_DAYS = 30

/** An address that deposited, or registered, at the given timestamp. */
export interface SenderActivity {
  sender: string
  timestamp: number
}

export type PrivacyAnonymitySetHistoryPoint = [
  timestamp: number,
  ...values: number[],
]

export type PrivacyAnonymitySetHoldingDurationPoint = [
  days: number,
  ...values: number[],
]

export function calculateAnonymitySetHistory(
  rows: PrivacyAnonymitySetSenderDayRecord[],
  series: PrivacyAnonymitySetSeries[],
  endpoints: number[],
): PrivacyAnonymitySetHistoryPoint[] {
  const valuesBySeries = series.map((item) =>
    countSendersInWindows(filterSeriesRows(rows, item), endpoints),
  )

  return endpoints.map((timestamp, index) => [
    timestamp,
    ...valuesBySeries.map((values) => values[index] ?? 0),
  ])
}

export function calculateAnonymitySetHoldingDuration(
  rows: PrivacyAnonymitySetSenderDayRecord[],
  series: PrivacyAnonymitySetSeries[],
  endpoint: number,
  durations: number[],
): PrivacyAnonymitySetHoldingDurationPoint[] {
  const valuesBySeries = series.map((item) =>
    countSendersByDuration(filterSeriesRows(rows, item), endpoint, durations),
  )

  return durations.map((days, index) => [
    days,
    ...valuesBySeries.map((values) => values[index] ?? 0),
  ])
}

/**
 * Distinct senders active during the ANONYMITY_SET_WINDOW_DAYS before each
 * endpoint. `endpoints` must be ascending.
 */
export function countSendersInWindows(
  rows: SenderActivity[],
  endpoints: number[],
): number[] {
  const sortedRows = rows.toSorted((a, b) => a.timestamp - b.timestamp)
  const countsBySender = new Map<string, number>()
  const result: number[] = []
  let addIndex = 0
  let removeIndex = 0

  for (const endpoint of endpoints) {
    while (addIndex < sortedRows.length) {
      const row = sortedRows[addIndex]
      if (row === undefined || row.timestamp >= endpoint) break

      countsBySender.set(row.sender, (countsBySender.get(row.sender) ?? 0) + 1)
      addIndex++
    }

    const windowStart = endpoint - ANONYMITY_SET_WINDOW_DAYS * UnixTime.DAY
    while (removeIndex < addIndex) {
      const row = sortedRows[removeIndex]
      if (row === undefined || row.timestamp >= windowStart) break

      const remaining = (countsBySender.get(row.sender) ?? 0) - 1
      if (remaining === 0) {
        countsBySender.delete(row.sender)
      } else {
        countsBySender.set(row.sender, remaining)
      }
      removeIndex++
    }

    result.push(countsBySender.size)
  }

  return result
}

/** Distinct senders active during the given number of days before the endpoint. */
export function countSendersByDuration(
  rows: SenderActivity[],
  endpoint: number,
  durations: number[],
): number[] {
  if (durations.length === 0) return []

  const maximumDays = Math.max(...durations)
  const latestBySender = new Map<string, number>()
  for (const row of rows) {
    if (row.timestamp >= endpoint) continue

    const current = latestBySender.get(row.sender)
    if (current === undefined || row.timestamp > current) {
      latestBySender.set(row.sender, row.timestamp)
    }
  }

  const additions = new Array<number>(maximumDays + 1).fill(0)
  for (const timestamp of latestBySender.values()) {
    const age = endpoint - timestamp
    const firstQualifyingDay = Math.ceil(age / UnixTime.DAY)
    if (firstQualifyingDay <= maximumDays) {
      const index = Math.max(1, firstQualifyingDay)
      additions[index] = (additions[index] ?? 0) + 1
    }
  }

  const cumulative = new Array<number>(maximumDays + 1).fill(0)
  for (let day = 1; day <= maximumDays; day++) {
    cumulative[day] = (cumulative[day - 1] ?? 0) + (additions[day] ?? 0)
  }
  return durations.map((days) => cumulative[days] ?? 0)
}

function filterSeriesRows(
  rows: PrivacyAnonymitySetSenderDayRecord[],
  series: PrivacyAnonymitySetSeries,
): PrivacyAnonymitySetSenderDayRecord[] {
  const threshold = BigInt(series.minimumAmount)
  return rows.filter(
    (row) =>
      row.projectId === series.projectId &&
      row.bucketId === series.bucketId &&
      row.maximumAmount >= threshold,
  )
}
