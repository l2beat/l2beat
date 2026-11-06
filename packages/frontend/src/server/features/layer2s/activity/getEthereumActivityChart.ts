import type { ActivityTotals } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import {
  type ActivityProjectChartStats,
  buildActivityProjectChartStats,
} from './buildActivityProjectChartStats'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivitySyncInfo } from './utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getRecentHours, toRecentPoints } from './utils/recentActivity'

export type EthereumActivityChartParams = v.infer<
  typeof EthereumActivityChartParams
>
export const EthereumActivityChartParams = v.object({
  range: ChartRange,
})

type EthereumActivityChartDataPoint = [
  timestamp: number,
  ethereumTxCount: number | null,
  ethereumUopsCount: number | null,
]

export type EthereumActivityChartData = {
  data: EthereumActivityChartDataPoint[]
  syncWarning: string | undefined
  syncedUntil: UnixTime
  stats: ActivityProjectChartStats | undefined
  /** Of the newest stored block, when the last point is today so far */
  liveUntil: UnixTime | undefined
}
/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, ethereumTxCount, ethereumUopsCount][] - all numbers
 */
export async function getEthereumActivityChart(
  params: EthereumActivityChartParams,
): Promise<EthereumActivityChartData> {
  if (env.MOCK) {
    return getMockEthereumActivityChart(params)
  }

  const db = getDb()

  const adjustedRange = await getFullySyncedActivityRange(params.range)

  const [entries, maxCounts, syncInfo, activityTotals] = await Promise.all([
    db.activity.getByProjectsAndTimeRange([ProjectId.ETHEREUM], adjustedRange),
    db.activity.getMaxCountsForProject(ProjectId.ETHEREUM),
    getActivitySyncInfo(ProjectId.ETHEREUM, adjustedRange[1]),
    db.activity.getActivityTotalsForProjects([ProjectId.ETHEREUM]),
  ])

  if (!syncInfo.hasSyncData) {
    return {
      data: [],
      syncWarning: undefined,
      syncedUntil: adjustedRange[1],
      stats: undefined,
      liveUntil: undefined,
    }
  }

  const { syncedUntil, syncWarning } = syncInfo

  const aggregatedEntries = aggregateActivityRecords(entries, {
    forEthereum: true,
  })

  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return {
      data: [],
      syncWarning,
      syncedUntil,
      stats: undefined,
      liveUntil: undefined,
    }
  }

  const startTimestamp = Math.min(...Object.keys(aggregatedEntries).map(Number))

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedRange[1]],
    'day',
  )

  const data: EthereumActivityChartDataPoint[] = timestamps.map((timestamp) => {
    const isSynced = syncedUntil >= timestamp
    const fallbackValue = isSynced ? 0 : null

    const entry = aggregatedEntries[timestamp]
    if (!entry || !isSynced) {
      return [timestamp, null, null]
    }

    return [
      timestamp,
      entry.ethereumCount ?? fallbackValue,
      entry.ethereumUopsCount ?? fallbackValue,
    ]
  })

  const stats = getEthereumActivityChartStats(
    data,
    syncedUntil,
    maxCounts,
    activityTotals[ProjectId.ETHEREUM],
  )

  const today = await getToday(data.at(-1)?.[0])
  return {
    data: today ? [...data, today.point] : data,
    syncWarning,
    syncedUntil,
    stats,
    liveUntil: today?.until,
  }
}

/** Today so far, past what activity has summed */
async function getToday(after: UnixTime | undefined) {
  if (after === undefined || !env.CLIENT_SIDE_HEARTBEAT_PAGE) return undefined
  const recent = (
    await getRecentHours(
      [ProjectId.ETHEREUM],
      UnixTime.toStartOf(UnixTime.now(), 'day'),
    )
  ).get(ProjectId.ETHEREUM)
  const point = recent && toRecentPoints(recent, 'day', after)[0]
  return point && recent ? { point, until: recent.until } : undefined
}

function getEthereumActivityChartStats(
  data: EthereumActivityChartDataPoint[],
  syncedUntil: UnixTime,
  maxCounts:
    | {
        uopsCount: number
        uopsTimestamp: number
        count: number
        countTimestamp: number
      }
    | undefined,
  totals: ActivityTotals | undefined,
): ActivityProjectChartStats | undefined {
  if (!maxCounts) return undefined

  const currentData = data.find(([timestamp]) => timestamp === syncedUntil)
  const sevenDaysAgoData = data.find(
    ([timestamp]) => timestamp === syncedUntil - 7 * UnixTime.DAY,
  )

  const pastDaySumTps = currentData?.[1] ?? null
  const pastDaySumUops = currentData?.[2] ?? pastDaySumTps
  const sevenDaysAgoTps = sevenDaysAgoData?.[1] ?? 0
  const sevenDaysAgoUops = sevenDaysAgoData?.[2] ?? sevenDaysAgoTps

  return buildActivityProjectChartStats({
    pastDayCount: pastDaySumTps,
    pastDayUopsCount: pastDaySumUops,
    sevenDaysAgoCount: sevenDaysAgoTps,
    sevenDaysAgoUopsCount: sevenDaysAgoUops,
    maxCounts,
    totals,
  })
}

function getMockEthereumActivityChart({
  range,
}: EthereumActivityChartParams): EthereumActivityChartData {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11]),
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
    stats: undefined,
    liveUntil: undefined,
  }
}
