import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import type { ActivityChartStats } from './getActivityChart'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { countPerSecond } from './utils/countPerSecond'
import { getActivitySyncInfo } from './utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

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
  stats: ActivityChartStats | undefined
}
/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, ethereumTxCount, ethereumUopsCount][] - all numbers
 */
export async function getEthereumActivityChart({
  range,
}: EthereumActivityChartParams): Promise<EthereumActivityChartData> {
  if (env.MOCK) {
    return getMockEthereumActivityChart({ range })
  }

  const db = getDb()

  const adjustedRange = await getFullySyncedActivityRange(range)

  const [entries, maxCounts, syncInfo, totalCounts] = await Promise.all([
    db.activity.getByProjectsAndTimeRange([ProjectId.ETHEREUM], adjustedRange),
    db.activity.getMaxCountsForProjects(),
    getActivitySyncInfo(ProjectId.ETHEREUM, adjustedRange[1]),
    db.activity.getTpsTotalsForProjects([ProjectId.ETHEREUM]),
  ])

  if (!syncInfo.hasSyncData) {
    return {
      data: [],
      syncWarning: undefined,
      syncedUntil: adjustedRange[1],
      stats: undefined,
    }
  }

  const { syncedUntil, syncWarning } = syncInfo

  const aggregatedEntries = aggregateActivityRecords(entries, {
    forEthereum: true,
  })

  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return { data: [], syncWarning, syncedUntil, stats: undefined }
  }

  const startTimestamp = Math.min(...Object.keys(aggregatedEntries).map(Number))

  const timestamps = generateTimestamps(
    [startTimestamp, adjustedRange[1]],
    'daily',
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
    totalCounts[ProjectId.ETHEREUM],
  )

  return {
    data,
    syncWarning,
    syncedUntil,
    stats,
  }
}

function getEthereumActivityChartStats(
  data: EthereumActivityChartDataPoint[],
  syncedUntil: UnixTime,
  maxCounts: Record<
    ProjectId,
    {
      uopsCount: number
      uopsTimestamp: number
      count: number
      countTimestamp: number
    }
  >,
  totalCount:
    | {
        count: number
        sinceTimestamp: number
      }
    | undefined,
): ActivityChartStats | undefined {
  const currentData = data.find(([timestamp]) => timestamp === syncedUntil)
  const sevenDaysAgoData = data.find(
    ([timestamp]) => timestamp === syncedUntil - 7 * UnixTime.DAY,
  )

  const pastDaySumTps = currentData?.[1] ?? null
  const pastDaySumUops = currentData?.[2] ?? pastDaySumTps
  const sevenDaysAgoTps = sevenDaysAgoData?.[1] ?? 0
  const sevenDaysAgoUops = sevenDaysAgoData?.[2] ?? sevenDaysAgoTps

  const maxCount = maxCounts[ProjectId.ETHEREUM]

  if (!maxCount) return undefined

  return {
    uops: {
      pastDaySum: pastDaySumUops,
      pastDayCount:
        pastDaySumUops !== null ? countPerSecond(pastDaySumUops) : null,
      pastDayChange:
        pastDaySumUops !== null
          ? calculatePercentageChange(pastDaySumUops, sevenDaysAgoUops)
          : 0,
      maxCount: {
        value: countPerSecond(maxCount.uopsCount),
        timestamp: maxCount.uopsTimestamp,
      },
    },
    tps: {
      pastDaySum: pastDaySumTps,
      pastDayCount:
        pastDaySumTps !== null ? countPerSecond(pastDaySumTps) : null,
      pastDayChange:
        pastDaySumTps !== null
          ? calculatePercentageChange(pastDaySumTps, sevenDaysAgoTps)
          : 0,
      maxCount: {
        value: countPerSecond(maxCount.count),
        timestamp: maxCount.countTimestamp,
      },
      totalCount: totalCount
        ? {
            value: totalCount.count,
            sinceTimestamp: totalCount.sinceTimestamp,
          }
        : undefined,
    },
  }
}

function getMockEthereumActivityChart({
  range,
}: EthereumActivityChartParams): EthereumActivityChartData {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11]),
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
    stats: undefined,
  }
}
