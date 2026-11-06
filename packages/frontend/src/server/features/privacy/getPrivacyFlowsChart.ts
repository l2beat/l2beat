import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ps } from '~/server/projects'
import {
  ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import {
  getPrivacyFlowBuckets,
  getPrivacyFlowSync,
  type PrivacyFlowSync,
} from './utils/getPrivacyFlowSync'

export const PrivacyFlowsChartParams = v.object({
  projectIds: v.array(v.string()),
  range: ChartRange,
})

export type PrivacyFlowsChartParams = v.infer<typeof PrivacyFlowsChartParams>

export type PrivacyFlowsChartPoint = [
  timestamp: number,
  depositsCount: number,
  withdrawalsCount: number,
  depositsValueUsd: number,
  withdrawalsValueUsd: number,
]

export interface PrivacyFlowsChartResponse {
  chart: PrivacyFlowsChartPoint[]
  /** Start of the last period every bucket has fully indexed. */
  syncedUntil: number | undefined
}

export async function getPrivacyFlowsChart(
  params: PrivacyFlowsChartParams,
): Promise<PrivacyFlowsChartResponse> {
  if (params.projectIds.length === 0) {
    return { chart: [], syncedUntil: undefined }
  }

  if (env.MOCK) {
    return getMockPrivacyFlowsChart(params)
  }

  const db = getDb()
  const projects = await ps.getProjects({
    ids: params.projectIds.map(ProjectId),
    select: ['privacyInfo'],
  })
  const buckets = getPrivacyFlowBuckets(projects)
  const records = await db.syncMetadata.getByFeatureAndIds(
    'privacy',
    buckets.map((bucket) => bucket.id),
  )
  const sync = getPrivacyFlowSync(buckets, records)
  const { resolution, from, to, syncedUntil } = getPrivacyFlowsChartWindow(
    params.range,
    sync,
    UnixTime.now(),
  )
  const step = UnixTime.periodToSeconds(resolution)

  const [rows, firstTimestamp] = await Promise.all([
    db.privacyFlowEvent.getBucketedByProjectIds(
      params.projectIds,
      from,
      to,
      resolution,
    ),
    db.privacyFlowEvent.getFirstTimestampByProjectIds(params.projectIds),
  ])

  if (rows.length === 0) {
    if (from === null || to - step < from) {
      return { chart: [], syncedUntil }
    }
    return {
      chart: generateTimestamps([from, to - step], resolution).map(
        (timestamp) => [timestamp, 0, 0, 0, 0],
      ),
      syncedUntil,
    }
  }

  const start = getChartStartTimestamp({
    rangeStart: from,
    firstProjectTimestamp: firstTimestamp,
    dataStart: Math.min(...rows.map((row) => row.timestamp)),
    resolution,
  })

  const grouped = new Map<
    number,
    {
      depositsCount: number
      withdrawalsCount: number
      depositsValueUsd: number
      withdrawalsValueUsd: number
    }
  >()

  for (const row of rows) {
    const entry = grouped.get(row.timestamp) ?? {
      depositsCount: 0,
      withdrawalsCount: 0,
      depositsValueUsd: 0,
      withdrawalsValueUsd: 0,
    }

    entry.depositsCount += row.depositCount
    entry.withdrawalsCount += row.withdrawalCount
    entry.depositsValueUsd += row.depositValueUsd
    entry.withdrawalsValueUsd += row.withdrawalValueUsd

    grouped.set(row.timestamp, entry)
  }

  return {
    // `to` is exclusive: the query never returns data for that bucket, so we
    // stop one bucket earlier to avoid a trailing empty data point.
    chart: generateTimestamps([start, to - step], resolution).map(
      (timestamp) => {
        const entry = grouped.get(timestamp)
        return [
          timestamp,
          entry?.depositsCount ?? 0,
          entry?.withdrawalsCount ?? 0,
          entry?.depositsValueUsd ?? 0,
          entry?.withdrawalsValueUsd ?? 0,
        ]
      },
    ),
    syncedUntil,
  }
}

/**
 * The buckets to chart. Each is a sum over its period, so only periods the
 * indexers have fully covered are shown: the chart runs up to the furthest
 * bucket's height, and `syncedUntil` marks where the slowest one is, so the
 * chart can grey out what a backfill has not reached yet. The client's range
 * end is only its guess of what is synced, so the heights replace it.
 */
export function getPrivacyFlowsChartWindow(
  range: ChartRange,
  sync: PrivacyFlowSync | undefined,
  now: UnixTime,
): {
  resolution: ChartResolution
  from: UnixTime | null
  /** Exclusive. */
  to: UnixTime
  syncedUntil: UnixTime | undefined
} {
  const resolution = rangeToResolution(range)
  const step = UnixTime.periodToSeconds(resolution)
  return {
    resolution,
    from: range[0] === null ? null : UnixTime.toStartOf(range[0], resolution),
    to: UnixTime.toStartOf(sync?.reached ?? now, resolution),
    syncedUntil:
      sync === undefined
        ? undefined
        : UnixTime.toStartOf(sync.slowest, resolution) - step,
  }
}

function getMockPrivacyFlowsChart(
  params: PrivacyFlowsChartParams,
): PrivacyFlowsChartResponse {
  const resolution = rangeToResolution(params.range)
  const days = rangeToDays(params.range) ?? 365
  const to = UnixTime.toStartOf(UnixTime.now(), resolution)
  const from = params.range[0] ?? to - days * UnixTime.DAY

  const chart = generateTimestamps([from, to], resolution).map(
    (timestamp): PrivacyFlowsChartPoint => {
      const depositsCount = Math.round(Math.random() * 100)
      const withdrawalsCount = Math.round(Math.random() * 100)
      return [
        timestamp,
        depositsCount,
        withdrawalsCount,
        depositsCount * (Math.random() * 9000 + 1000),
        withdrawalsCount * (Math.random() * 9000 + 1000),
      ]
    },
  )

  return { chart, syncedUntil: to }
}
