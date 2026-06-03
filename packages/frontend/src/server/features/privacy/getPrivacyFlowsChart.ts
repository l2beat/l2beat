import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { generateTimestamps } from '~/server/features/utils/generateTimestamps'
import { getChartStartTimestamp } from '~/server/features/utils/getChartStartTimestamp'
import { ChartRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/rangeToDays'

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

  const [dailyRows, syncedUntil, firstTimestamp] = await Promise.all([
    db.privacyFlowEvent.getDailyByProjectIds(
      params.projectIds,
      ...params.range,
    ),
    db.privacyFlowEvent.getLatestTimestampByProjectIds(params.projectIds),
    db.privacyFlowEvent.getFirstTimestampByProjectIds(params.projectIds),
  ])

  const projectIds = new Set(params.projectIds)
  const historyRows = dailyRows.filter(
    (row) => projectIds.has(row.projectId) && Number(row.timestamp) > 0,
  )

  if (historyRows.length === 0) {
    if (params.range[0] === null) {
      return {
        chart: [],
        syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
      }
    }

    return {
      chart: generateTimestamps(
        normalizePrivacyFlowsChartRange(
          params.range,
          undefined,
          firstTimestamp,
        ),
        'daily',
      ).map((timestamp) => [timestamp, 0, 0, 0, 0]),
      syncedUntil: syncedUntil ? Number(syncedUntil) : undefined,
    }
  }

  const minTimestamp = Math.min(
    ...historyRows.map((row) => Number(row.timestamp)),
  )
  const normalizedRange = normalizePrivacyFlowsChartRange(
    params.range,
    minTimestamp,
    firstTimestamp,
  )
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

    const entry = grouped.get(Number(row.timestamp)) ?? {
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
    chart: generateTimestamps(normalizedRange, 'daily').map((timestamp) => {
      const entry = grouped.get(timestamp)
      return [
        timestamp,
        entry?.depositsCount ?? 0,
        entry?.withdrawalsCount ?? 0,
        entry?.depositsValueUsd ?? 0,
        entry?.withdrawalsValueUsd ?? 0,
      ] as PrivacyFlowsChartPoint
    }),
    syncedUntil: syncedUntil ? Number(syncedUntil) : Number(normalizedRange[1]),
  }
}

function getMockPrivacyFlowsChart(
  params: PrivacyFlowsChartParams,
): PrivacyFlowsChartResponse {
  const days = rangeToDays(params.range) ?? 365
  const to = UnixTime.toStartOf(UnixTime.now(), 'day')
  const from = params.range[0] ?? to - days * UnixTime.DAY

  const chart = generateTimestamps([UnixTime(from), UnixTime(to)], 'daily').map(
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

function normalizePrivacyFlowsChartRange(
  range: ChartRange,
  minTimestamp?: number,
  firstProjectTimestamp?: number,
): [UnixTime, UnixTime] {
  const start = getChartStartTimestamp({
    rangeStart: range[0],
    firstProjectTimestamp,
    dataStart: minTimestamp ?? range[1],
    resolution: 'daily',
  })
  const from = UnixTime.toStartOf(start, 'day')
  const to = UnixTime.toStartOf(range[1], 'day')

  return [UnixTime(from), UnixTime(to)]
}
