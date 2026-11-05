import type { ActivityTotals } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
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
import {
  type ActivityResolution,
  getActivityResolution,
} from './utils/getActivityResolution'
import { getActivitySyncInfo } from './utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getHourlyActivityRecords } from './utils/getHourlyActivityRecords'
import { getRollingDays } from './utils/getHourlyActivityWindow'
import {
  getLiveActivityRates,
  getLiveActivitySyncWarning,
  getLiveHourlyPoints,
  type LatestHours,
  LIVE_RATE_FULL_HOURS,
  toHourlyPoints,
} from './utils/liveActivity'

export type EthereumActivityChartParams = v.infer<
  typeof EthereumActivityChartParams
>
export const EthereumActivityChartParams = v.object({
  range: ChartRange,
  /** Lets the shortest ranges read hours */
  hourly: v.boolean().optional(),
})

/** Hourly ranges start at most eight days back, plus a day of slack */
const LIVE_HOURLY_FULL_HOURS = 9 * 24

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
  resolution: ActivityResolution
  /** The last hourly data point counts only its hour up to `until` */
  partialHour: { from: UnixTime; until: UnixTime } | undefined
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

  const resolution: ActivityResolution = params.hourly
    ? getActivityResolution(params.range)
    : 'day'
  const adjustedRange = await getFullySyncedActivityRange(params.range)

  const [maxCounts, syncInfo, activityTotals, latestHours] = await Promise.all([
    db.activity.getMaxCountsForProject(ProjectId.ETHEREUM),
    getActivitySyncInfo(ProjectId.ETHEREUM, adjustedRange[1]),
    db.activity.getActivityTotalsForProjects([ProjectId.ETHEREUM]),
    // Undefined until the indexer records its latest block, as after an
    // invalidation. Everything then reads full hours and days as before
    db.hourlyActivity.getLatestHours(
      ProjectId.ETHEREUM,
      resolution === 'hour' ? LIVE_HOURLY_FULL_HOURS : LIVE_RATE_FULL_HOURS,
    ),
  ])

  if (!syncInfo.hasSyncData) {
    return {
      data: [],
      syncWarning: undefined,
      syncedUntil: adjustedRange[1],
      stats: undefined,
      resolution,
      partialHour: undefined,
    }
  }

  const { syncedUntil } = syncInfo
  const syncWarning = latestHours
    ? getLiveActivitySyncWarning(
        latestHours.latestBlockTimestamp,
        UnixTime.now(),
      )
    : syncInfo.syncWarning

  // The stats compare the past day with a week before, so they need days
  const dailyRange: ChartRange =
    resolution === 'hour'
      ? [syncedUntil - 7 * UnixTime.DAY, adjustedRange[1]]
      : adjustedRange
  const entries = await db.activity.getByProjectsAndTimeRange(
    [ProjectId.ETHEREUM],
    dailyRange,
  )

  const aggregatedEntries = aggregateActivityRecords(entries, {
    forEthereum: true,
  })

  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return {
      data: [],
      syncWarning,
      syncedUntil,
      stats: undefined,
      resolution,
      partialHour: undefined,
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
    latestHours,
  )

  if (resolution === 'day') {
    return {
      data,
      syncWarning,
      syncedUntil,
      stats,
      resolution,
      partialHour: undefined,
    }
  }

  const hourly = latestHours
    ? getLiveHourlyData(latestHours, params.range)
    : await getFullHourlyData(params.range)
  return { ...hourly, syncWarning, stats, resolution }
}

/** Full hours, then the hour of the latest block up to it */
function getLiveHourlyData(latestHours: LatestHours, range: ChartRange) {
  const [from, to] = range
  assert(from !== null, 'Hourly range without a start')
  const lastHour = UnixTime.toStartOf(latestHours.latestBlockTimestamp, 'hour')
  const days = getRollingDays(from, to)
  const start =
    days === undefined ? from : lastHour - days * UnixTime.DAY + UnixTime.HOUR
  const { points, partialHour } = getLiveHourlyPoints(latestHours, start)
  return {
    data: points,
    syncedUntil: points.at(-1)?.[0] ?? lastHour,
    partialHour,
  }
}

async function getFullHourlyData(range: ChartRange) {
  const { records, window } = await getHourlyActivityRecords(
    [ProjectId.ETHEREUM],
    range,
    { waitFor: [ProjectId.ETHEREUM] },
  )
  return {
    data: toHourlyPoints(records, [window.start, window.end]),
    syncedUntil: window.end,
    partialHour: undefined,
  }
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
  latestHours: LatestHours | undefined,
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

  const stats = buildActivityProjectChartStats({
    pastDayCount: pastDaySumTps,
    pastDayUopsCount: pastDaySumUops,
    sevenDaysAgoCount: sevenDaysAgoTps,
    sevenDaysAgoUopsCount: sevenDaysAgoUops,
    maxCounts,
    totals,
  })
  if (!latestHours) return stats

  // Only the rates run to the latest block. The counts and the change stay
  // those of the last full day
  const rates = getLiveActivityRates(latestHours)
  return {
    tps: { ...stats.tps, pastDayCount: rates.tps },
    uops: { ...stats.uops, pastDayCount: rates.uops },
    liveAsOf: rates.asOf,
  }
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
    resolution: 'day',
    partialHour: undefined,
  }
}
