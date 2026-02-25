import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import type { ActivityChartData } from './getActivityChart'
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
  stats:
    | {
        uops: {
          pastDayCount: number | null
          pastDaySum: number | null
          maxCount: {
            value: number
            timestamp: number
          }
        }
        tps: {
          pastDayCount: number | null
          pastDaySum: number | null
          maxCount: {
            value: number
            timestamp: number
          }
        }
      }
    | undefined
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

  const [entries, maxCounts, syncInfo] = await Promise.all([
    db.activity.getByProjectsAndTimeRange([ProjectId.ETHEREUM], adjustedRange),
    db.activity.getMaxCountsForProjects(),
    getActivitySyncInfo(ProjectId.ETHEREUM, adjustedRange[1]),
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

  const stats = getEthereumActivityChartStats(data, maxCounts)

  return {
    data,
    syncWarning,
    syncedUntil,
    stats,
  }
}

function getEthereumActivityChartStats(
  data: EthereumActivityChartDataPoint[],
  maxCounts: Record<
    ProjectId,
    {
      uopsCount: number
      uopsTimestamp: number
      count: number
      countTimestamp: number
    }
  >,
): ActivityChartData['stats'] {
  const pastDaySumTps = data.at(-1)?.[1] ?? null
  const pastDaySumUops = data.at(-1)?.[2] ?? pastDaySumTps

  const maxCount = maxCounts[ProjectId.ETHEREUM]

  if (!maxCount) return undefined

  return {
    uops: {
      pastDaySum: pastDaySumUops,
      pastDayCount:
        pastDaySumUops !== null ? countPerSecond(pastDaySumUops) : null,
      maxCount: {
        value: countPerSecond(maxCount.uopsCount),
        timestamp: maxCount.uopsTimestamp,
      },
    },
    tps: {
      pastDaySum: pastDaySumTps,
      pastDayCount:
        pastDaySumTps !== null ? countPerSecond(pastDaySumTps) : null,
      maxCount: {
        value: countPerSecond(maxCount.count),
        timestamp: maxCount.countTimestamp,
      },
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
