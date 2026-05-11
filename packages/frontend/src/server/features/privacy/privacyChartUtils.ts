import type { PrivacyFlowBucketTotalRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { ChartRange } from '~/utils/range/range'
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
  dailyRows: Array<{
    projectId: string
    bucketId: string
    timestamp: UnixTime
    depositCount: number
    withdrawalCount: number
    depositAmount: bigint
    withdrawalAmount: bigint
  }>,
  syncedUntil: UnixTime | undefined,
  priceById: Map<string, number>,
  range: PrivacyChartParams['range'],
): PrivacyChartResponse {
  const projectIds = new Set(projects.map((project) => project.id.toString()))
  const historyRows = dailyRows.filter(
    (row) => projectIds.has(row.projectId) && Number(row.timestamp) > 0,
  )

  if (historyRows.length === 0) {
    if (range[0] === null) {
      return {
        chart: [],
        syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
      }
    }

    return {
      chart: generateTimestamps(normalizePrivacyChartRange(range), 'daily').map(
        (timestamp) => [timestamp, 0, 0, 0, 0],
      ),
      syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
    }
  }

  const minTimestamp = Math.min(
    ...historyRows.map((row) => Number(row.timestamp)),
  )
  const normalizedRange = normalizePrivacyChartRange(range, minTimestamp)
  const bucketInfoByKey = buildPrivacyBucketInfoByKey(projects, priceById)
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
      Number(row.timestamp) < normalizedRange[0] ||
      Number(row.timestamp) > normalizedRange[1]
    ) {
      continue
    }

    const bucketInfo = bucketInfoByKey.get(
      getPrivacyBucketKey(row.projectId, row.bucketId),
    )
    if (!bucketInfo) continue

    const entry = grouped.get(Number(row.timestamp)) ?? {
      depositsCount: 0,
      withdrawalsCount: 0,
      depositsValueUsd: 0,
      withdrawalsValueUsd: 0,
    }

    entry.depositsCount += row.depositCount
    entry.withdrawalsCount += row.withdrawalCount
    entry.depositsValueUsd += amountToUsd(
      row.depositAmount,
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )
    entry.withdrawalsValueUsd += amountToUsd(
      row.withdrawalAmount,
      bucketInfo.decimals,
      bucketInfo.priceUsd,
    )

    grouped.set(Number(row.timestamp), entry)
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
    syncedUntil: syncedUntil ? Number(syncedUntil) : Number(normalizedRange[1]),
  }
}

export function buildPrivacyTvlChart(
  projects: PrivacyProjectConfig[],
  dailyRows: Array<{
    projectId: string
    bucketId: string
    timestamp: UnixTime
    depositCount: number
    withdrawalCount: number
    depositAmount: bigint
    withdrawalAmount: bigint
  }>,
  bucketTotals: PrivacyFlowBucketTotalRecord[],
  syncedUntil: UnixTime | undefined,
  priceById: Map<string, number>,
  range: PrivacyChartParams['range'],
): PrivacyTvlChartResponse {
  const projectIds = new Set(projects.map((project) => project.id.toString()))
  const filteredHistoryRows = dailyRows.filter(
    (row) => projectIds.has(row.projectId) && Number(row.timestamp) > 0,
  )
  const filteredTotals = bucketTotals.filter((row) =>
    projectIds.has(row.projectId),
  )

  const historySyncedUntil = syncedUntil
    ? UnixTime.toStartOf(Number(syncedUntil), 'day')
    : undefined
  const snapshotSyncedUntil =
    filteredTotals.length > 0
      ? UnixTime.toStartOf(
          Math.max(...dailyRows.map((row) => Number(row.timestamp))),
          'day',
        )
      : undefined
  const syncedUntilDay = minDefined(historySyncedUntil, snapshotSyncedUntil)
  const anchorDay =
    syncedUntilDay ??
    snapshotSyncedUntil ??
    (filteredHistoryRows.length > 0
      ? UnixTime.toStartOf(
          Math.max(...filteredHistoryRows.map((row) => Number(row.timestamp))),
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
      ? Math.min(...filteredHistoryRows.map((row) => Number(row.timestamp)))
      : Number(anchorDay)
  const normalizedRange = normalizePrivacyChartRange(range, minTimestamp)
  const bucketInfoByKey = buildPrivacyBucketInfoByKey(projects, priceById)
  const netValueUsdByDay = new Map<number, number>()

  for (const row of filteredHistoryRows) {
    const bucketInfo = bucketInfoByKey.get(
      getPrivacyBucketKey(row.projectId, row.bucketId),
    )
    if (!bucketInfo) continue

    const netValueUsd =
      amountToUsd(row.depositAmount, bucketInfo.decimals, bucketInfo.priceUsd) -
      amountToUsd(
        row.withdrawalAmount,
        bucketInfo.decimals,
        bucketInfo.priceUsd,
      )

    netValueUsdByDay.set(
      Number(row.timestamp),
      (netValueUsdByDay.get(Number(row.timestamp)) ?? 0) + netValueUsd,
    )
  }

  const anchorValueUsd = filteredTotals.reduce((sum, row) => {
    const bucketInfo = bucketInfoByKey.get(
      getPrivacyBucketKey(row.projectId, row.bucketId),
    )
    if (!bucketInfo) return sum
    const balance =
      amountToUsd(row.depositAmount, bucketInfo.decimals, bucketInfo.priceUsd) -
      amountToUsd(
        row.withdrawalAmount,
        bucketInfo.decimals,
        bucketInfo.priceUsd,
      )
    return sum + balance
  }, 0)

  const allTimestamps = generateTimestamps(
    [UnixTime(minTimestamp), anchorDay],
    'daily',
  )
  const valueByDay = new Map<number, number>()
  let currentValueUsd = anchorValueUsd
  valueByDay.set(Number(anchorDay), currentValueUsd)

  for (let index = allTimestamps.length - 2; index >= 0; index--) {
    const nextDay = allTimestamps[index + 1]
    const timestamp = allTimestamps[index]
    if (nextDay === undefined || timestamp === undefined) {
      continue
    }
    currentValueUsd -= netValueUsdByDay.get(nextDay) ?? 0
    valueByDay.set(timestamp, currentValueUsd)
  }

  const rangeEnd = Math.min(Number(normalizedRange[1]), Number(anchorDay))

  return {
    chart: generateTimestamps(
      [normalizedRange[0], UnixTime(rangeEnd)],
      'daily',
    ).map(
      (timestamp) =>
        [timestamp, valueByDay.get(timestamp) ?? 0] as PrivacyTvlChartPoint,
    ),
    syncedUntil: syncedUntilDay ?? anchorDay,
  }
}

export function getPrivacyChartSyncedUntil(
  cursors: { syncedAt: number }[],
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
  return UnixTime(Math.min(Number(a), Number(b)))
}
