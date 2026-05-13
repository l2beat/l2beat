import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange } from '~/utils/range/range'
import type { PrivacyBucketRow } from './db/PrivacyBucketRepo'
import type {
  PrivacyHistoryCursor,
  PrivacyHistoryDayRow,
} from './db/PrivacyHistoryRepo'
import {
  amountToUsd,
  buildPrivacyBucketInfoByKey,
  getPrivacyBucketKey,
} from './privacyUtils'
import type { PrivacyProjectConfig } from './types'

export const PrivacyChartParams = v.object({
  range: ChartRange,
})

export type PrivacyChartParams = v.infer<typeof PrivacyChartParams>

export type PrivacyChartPoint = [
  timestamp: number,
  depositsCount: number,
  withdrawalsCount: number,
  depositsValueUsd: number,
  withdrawalsValueUsd: number,
]

export type PrivacyTvlChartPoint = [
  timestamp: number,
  totalValueLockedUsd: number,
]

export interface PrivacyChartResponse {
  chart: PrivacyChartPoint[]
  syncedUntil: number | undefined
}

export interface PrivacyTvlChartResponse {
  chart: PrivacyTvlChartPoint[]
  syncedUntil: number | undefined
}

export function buildPrivacyChart(
  projects: PrivacyProjectConfig[],
  rows: PrivacyHistoryDayRow[],
  cursors: PrivacyHistoryCursor[],
  range: PrivacyChartParams['range'],
): PrivacyChartResponse {
  const projectIds = new Set(projects.map((project) => project.id.toString()))
  const historyRows = rows.filter(
    (row) => projectIds.has(row.projectId) && row.timestamp > 0,
  )
  const syncedUntil = getPrivacyChartSyncedUntil(
    cursors.filter((cursor) => projectIds.has(cursor.key.split('::')[0] ?? '')),
  )

  if (historyRows.length === 0) {
    if (range[0] === null) {
      return { chart: [], syncedUntil }
    }

    return {
      chart: generateTimestamps(normalizePrivacyChartRange(range), 'daily').map(
        (timestamp) => [timestamp, 0, 0, 0, 0],
      ),
      syncedUntil,
    }
  }

  const minTimestamp = Math.min(...historyRows.map((row) => row.timestamp))
  const normalizedRange = normalizePrivacyChartRange(range, minTimestamp)
  const bucketInfoByKey = buildPrivacyBucketInfoByKey(projects)
  const grouped = new Map<
    number,
    {
      depositsCount: number
      withdrawalsCount: number
      depositsValueUsd: number
      withdrawalsValueUsd: number
    }
  >()

  for (const row of historyRows) {
    if (
      row.timestamp < normalizedRange[0] ||
      row.timestamp > normalizedRange[1]
    ) {
      continue
    }

    const bucketInfo = bucketInfoByKey.get(
      getPrivacyBucketKey(row.projectId, row.assetKey, row.bucketId),
    )
    if (!bucketInfo) continue

    const entry = grouped.get(row.timestamp) ?? {
      depositsCount: 0,
      withdrawalsCount: 0,
      depositsValueUsd: 0,
      withdrawalsValueUsd: 0,
    }

    entry.depositsCount += row.depositCount
    entry.withdrawalsCount += row.withdrawalCount
    entry.depositsValueUsd += amountToUsd(
      BigInt(row.depositAmount),
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )
    entry.withdrawalsValueUsd += amountToUsd(
      BigInt(row.withdrawalAmount),
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )

    grouped.set(row.timestamp, entry)
  }

  return {
    chart: generateTimestamps(normalizedRange, 'daily').map((timestamp) => {
      const entry = grouped.get(timestamp)
      return [
        timestamp,
        entry?.depositsCount ?? 0,
        entry?.withdrawalsCount ?? 0,
        entry?.depositsValueUsd ?? 0,
        entry?.withdrawalsValueUsd ?? 0,
      ] as PrivacyChartPoint
    }),
    syncedUntil: syncedUntil ?? normalizedRange[1],
  }
}

export function buildPrivacyTvlChart(
  projects: PrivacyProjectConfig[],
  historyRows: PrivacyHistoryDayRow[],
  cursors: PrivacyHistoryCursor[],
  snapshotRows: PrivacyBucketRow[],
  range: PrivacyChartParams['range'],
): PrivacyTvlChartResponse {
  const projectIds = new Set(projects.map((project) => project.id.toString()))
  const filteredHistoryRows = historyRows.filter(
    (row) => projectIds.has(row.projectId) && row.timestamp > 0,
  )
  const filteredSnapshotRows = snapshotRows.filter((row) =>
    projectIds.has(row.projectId),
  )
  const historySyncedUntil = getPrivacyChartSyncedUntil(
    cursors.filter((cursor) => projectIds.has(cursor.key.split('::')[0] ?? '')),
  )
  const snapshotSyncedUntil =
    filteredSnapshotRows.length > 0
      ? UnixTime.toStartOf(
          Math.max(...filteredSnapshotRows.map((row) => row.timestamp)),
          'day',
        )
      : undefined
  const syncedUntil = minDefined(historySyncedUntil, snapshotSyncedUntil)
  const anchorDay =
    syncedUntil ??
    snapshotSyncedUntil ??
    (filteredHistoryRows.length > 0
      ? UnixTime.toStartOf(
          Math.max(...filteredHistoryRows.map((row) => row.timestamp)),
          'day',
        )
      : undefined)

  if (anchorDay === undefined) {
    if (range[0] === null) {
      return { chart: [], syncedUntil: undefined }
    }

    return {
      chart: generateTimestamps(normalizePrivacyChartRange(range), 'daily').map(
        (timestamp) => [timestamp, 0] as PrivacyTvlChartPoint,
      ),
      syncedUntil: undefined,
    }
  }

  const minTimestamp =
    filteredHistoryRows.length > 0
      ? Math.min(...filteredHistoryRows.map((row) => row.timestamp))
      : anchorDay
  const normalizedRange = normalizePrivacyChartRange(range, minTimestamp)
  const bucketInfoByKey = buildPrivacyBucketInfoByKey(projects)
  const netValueUsdByDay = new Map<number, number>()

  for (const row of filteredHistoryRows) {
    const bucketInfo = bucketInfoByKey.get(
      getPrivacyBucketKey(row.projectId, row.assetKey, row.bucketId),
    )
    if (!bucketInfo) continue

    const netValueUsd =
      amountToUsd(
        BigInt(row.depositAmount),
        bucketInfo.decimals,
        bucketInfo.priceUsd,
      ) -
      amountToUsd(
        BigInt(row.withdrawalAmount),
        bucketInfo.decimals,
        bucketInfo.priceUsd,
      )

    netValueUsdByDay.set(
      row.timestamp,
      (netValueUsdByDay.get(row.timestamp) ?? 0) + netValueUsd,
    )
  }

  const anchorValueUsd = filteredSnapshotRows.reduce(
    (sum, row) => sum + (row.totalValueUsd ?? 0),
    0,
  )
  const allTimestamps = generateTimestamps(
    [UnixTime(minTimestamp), anchorDay],
    'daily',
  )
  const valueByDay = new Map<number, number>()
  let currentValueUsd = anchorValueUsd
  valueByDay.set(anchorDay, currentValueUsd)

  for (let index = allTimestamps.length - 2; index >= 0; index--) {
    const nextDay = allTimestamps[index + 1]
    const timestamp = allTimestamps[index]
    if (nextDay === undefined || timestamp === undefined) {
      continue
    }
    currentValueUsd -= netValueUsdByDay.get(nextDay) ?? 0
    valueByDay.set(timestamp, currentValueUsd)
  }

  const rangeEnd = Math.min(normalizedRange[1], anchorDay)

  return {
    chart: generateTimestamps(
      [normalizedRange[0], UnixTime(rangeEnd)],
      'daily',
    ).map(
      (timestamp) =>
        [timestamp, valueByDay.get(timestamp) ?? 0] as PrivacyTvlChartPoint,
    ),
    syncedUntil: syncedUntil ?? anchorDay,
  }
}

export function getPrivacyChartSyncedUntil(
  cursors: PrivacyHistoryCursor[],
): UnixTime | undefined {
  if (cursors.length === 0) return undefined

  return UnixTime.toStartOf(
    Math.min(...cursors.map((cursor) => cursor.syncedAt)),
    'day',
  )
}

function normalizePrivacyChartRange(
  range: PrivacyChartParams['range'],
  minTimestamp?: number,
): [UnixTime, UnixTime] {
  const from =
    range[0] === null
      ? UnixTime.toStartOf(minTimestamp ?? range[1], 'day')
      : UnixTime.toStartOf(range[0], 'day')
  const to = UnixTime.toStartOf(range[1], 'day')

  return [UnixTime(from), UnixTime(to)]
}

function minDefined(a: UnixTime | undefined, b: UnixTime | undefined) {
  if (a === undefined) return b
  if (b === undefined) return a
  return UnixTime(Math.min(a, b))
}
