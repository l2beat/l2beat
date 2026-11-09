import { getPrivacyBucketAddress } from '@l2beat/shared'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ps } from '~/server/projects'
import { ChartRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'
import { getFullySyncedPrivacyRange } from './utils/getFullySyncedPrivacyRange'

export const PrivacyFlowsChartParams = v.object({
  projectIds: v.array(v.string()),
  range: ChartRange,
  /** Limits the flows to the buckets on this chain. */
  chain: v.string().optional(),
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
  const [from, to] = getFullySyncedPrivacyRange(params.range)

  const [dailyRows, syncedUntil, firstTimestamp, chainBucketIds] =
    await Promise.all([
      db.privacyFlowEvent.getDailyByProjectIds(params.projectIds, from, to),
      db.privacyFlowEvent.getLatestTimestampByProjectIds(params.projectIds),
      db.privacyFlowEvent.getFirstTimestampByProjectIds(params.projectIds),
      params.chain === undefined
        ? undefined
        : getChainBucketIds(params.projectIds, params.chain),
    ])

  const projectIds = new Set(params.projectIds)
  const historyRows = dailyRows.filter(
    (row) =>
      projectIds.has(row.projectId) &&
      (chainBucketIds === undefined || chainBucketIds.has(row.bucketId)) &&
      Number(row.timestamp) > 0,
  )

  if (historyRows.length === 0) {
    if (from === null) {
      return {
        chart: [],
        syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
      }
    }

    return {
      chart: generateTimestamps([from, to - UnixTime.DAY], 'day').map(
        (timestamp) => [timestamp, 0, 0, 0, 0],
      ),
      syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
    }
  }

  const dataStart = Math.min(...historyRows.map((row) => Number(row.timestamp)))

  const start = getChartStartTimestamp({
    rangeStart: from,
    firstProjectTimestamp: firstTimestamp,
    dataStart,
    resolution: 'day',
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

  for (const row of historyRows) {
    if ((from && row.timestamp < from) || row.timestamp > to) {
      continue
    }

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

    grouped.set(Number(row.timestamp), entry)
  }

  return {
    // `to` is exclusive: the query never returns data for that day, so we
    // stop one day earlier to avoid a trailing empty data point.
    chart: generateTimestamps([start, to - UnixTime.DAY], 'day').map(
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
    syncedUntil: syncedUntil ? syncedUntil : to,
  }
}

async function getChainBucketIds(
  projectIds: string[],
  chain: string,
): Promise<Set<string>> {
  const projects = await ps.getProjects({
    ids: projectIds.map(ProjectId),
    select: ['privacyInfo'],
  })
  return new Set(
    projects.flatMap((project) =>
      project.privacyInfo.tokens.flatMap((token) =>
        token.buckets.flatMap((bucket) =>
          getPrivacyBucketAddress(bucket.address).chain === chain
            ? [bucket.id]
            : [],
        ),
      ),
    ),
  )
}

function getMockPrivacyFlowsChart(
  params: PrivacyFlowsChartParams,
): PrivacyFlowsChartResponse {
  const days = rangeToDays(params.range) ?? 365
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = params.range[0] ?? to - days * UnixTime.DAY

  // A chain holds part of the total, so its mock flows are smaller.
  const scale = params.chain === undefined ? 1 : 0.4
  const chart = generateTimestamps([from, to], 'day').map(
    (timestamp): PrivacyFlowsChartPoint => {
      const depositsCount = Math.round(Math.random() * 100 * scale)
      const withdrawalsCount = Math.round(Math.random() * 100 * scale)
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
