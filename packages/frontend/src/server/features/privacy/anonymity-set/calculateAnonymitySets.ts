import type { PrivacyAnonymitySetSenderDayRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'

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
  windowDays = 30,
): PrivacyAnonymitySetHistoryPoint[] {
  const valuesBySeries = series.map((item) =>
    calculateSeriesHistory(rows, item, endpoints, windowDays),
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
  if (durations.length === 0) return []

  const maximumDays = Math.max(...durations)
  const valuesBySeries = series.map((item) => {
    const threshold = BigInt(item.minimumAmount)
    const latestBySender = new Map<string, number>()

    for (const row of rows) {
      if (
        row.projectId !== item.projectId ||
        row.bucketId !== item.bucketId ||
        row.maximumAmount < threshold ||
        row.timestamp >= endpoint
      ) {
        continue
      }

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

    const result = new Array<number>(maximumDays + 1).fill(0)
    for (let day = 1; day <= maximumDays; day++) {
      result[day] = (result[day - 1] ?? 0) + (additions[day] ?? 0)
    }
    return result
  })

  return durations.map((days) => [
    days,
    ...valuesBySeries.map((values) => values[days] ?? 0),
  ])
}

function calculateSeriesHistory(
  rows: PrivacyAnonymitySetSenderDayRecord[],
  series: PrivacyAnonymitySetSeries,
  endpoints: number[],
  windowDays: number,
): number[] {
  const threshold = BigInt(series.minimumAmount)
  const qualifyingRows = rows
    .filter(
      (row) =>
        row.projectId === series.projectId &&
        row.bucketId === series.bucketId &&
        row.maximumAmount >= threshold,
    )
    .sort((a, b) => a.timestamp - b.timestamp)

  const countsBySender = new Map<string, number>()
  const result: number[] = []
  let addIndex = 0
  let removeIndex = 0

  for (const endpoint of endpoints) {
    while (addIndex < qualifyingRows.length) {
      const row = qualifyingRows[addIndex]
      if (row === undefined || row.timestamp >= endpoint) break

      countsBySender.set(row.sender, (countsBySender.get(row.sender) ?? 0) + 1)
      addIndex++
    }

    const windowStart = endpoint - windowDays * UnixTime.DAY
    while (removeIndex < addIndex) {
      const row = qualifyingRows[removeIndex]
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
