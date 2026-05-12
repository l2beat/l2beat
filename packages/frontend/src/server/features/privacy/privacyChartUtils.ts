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

export type PrivacyTvsChartPoint = [
  timestamp: number,
  totalValueSecuredUsd: number,
]

export interface PrivacyChartResponse {
  chart: PrivacyChartPoint[]
  syncedUntil: number | undefined
}

export interface PrivacyTvsChartResponse {
  chart: PrivacyTvsChartPoint[]
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
