import type { ActivityRecord, ActivityTotals } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ChartRange } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generateTimestamps'
import { getChartStartTimestamp } from '../../utils/getChartStartTimestamp'
import {
  type ActivityMaxPeaks,
  type ActivityProjectChartStats,
  buildActivityProjectChartStats,
} from './buildActivityProjectChartStats'
import { aggregateActivityRecords } from './utils/aggregateActivityRecords'
import { getActivityProjects } from './utils/getActivityProjects'
import {
  type ActivityResolution,
  getActivityResolution,
} from './utils/getActivityResolution'
import { getActivitySyncInfo } from './utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getHourlyActivityRecords } from './utils/getHourlyActivityRecords'
import {
  ActivityProjectFilter,
  createActivityProjectsFilter,
} from './utils/projectFilterUtils'

export type ActivityChartParams = v.infer<typeof ActivityChartParams>
export const ActivityChartParams = v.object({
  filter: ActivityProjectFilter,
  range: ChartRange,
  /** Lets the shortest ranges read hours. Callers that read days leave it out */
  hourly: v.boolean().optional(),
})

type ActivityChartDataPoint = [
  timestamp: number,
  projectsTxCount: number | null,
  ethereumTxCount: number | null,
  projectsUopsCount: number | null,
  ethereumUopsCount: number | null,
]

export type ActivityChartData = {
  data: ActivityChartDataPoint[]
  syncWarning: string | undefined
  syncedUntil: UnixTime
  stats: ActivityProjectChartStats | undefined
  resolution: ActivityResolution
  /** Of a single project. Projects indexed per day have no hours */
  hasHourly: boolean | undefined
}
/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, projectsTxCount, ethereumTxCount, projectsUopsCount, ethereumUopsCount][] - all numbers
 */
export async function getActivityChart({
  filter,
  range,
  hourly,
}: ActivityChartParams): Promise<ActivityChartData> {
  if (env.MOCK) {
    return getMockActivityChart({ filter, range })
  }

  const db = getDb()
  const projects = (await getActivityProjects())
    .filter(createActivityProjectsFilter(filter))
    .map((p) => p.id)
    .concat(ProjectId.ETHEREUM)
  const projectId = projects.length === 2 ? projects[0] : undefined
  const adjustedRange = await getFullySyncedActivityRange(range)

  const [hasHourly, maxCounts, peaks, activityTotals, syncInfo] =
    await Promise.all([
      hourly && projectId
        ? db.hourlyActivity.checkIfExists(projectId)
        : undefined,
      projectId ? db.activity.getMaxCountsForProject(projectId) : undefined,
      projectId ? db.activity.getMaxPeaksForProject(projectId) : undefined,
      projectId
        ? db.activity.getActivityTotalsForProjects([projectId])
        : undefined,
      // A single project is synced until the last day we have data for
      projectId ? getActivitySyncInfo(projectId, adjustedRange[1]) : undefined,
    ])
  const resolution =
    hourly && hasHourly !== false ? getActivityResolution(range) : 'day'

  if (syncInfo && !syncInfo.hasSyncData) {
    return {
      data: [],
      syncWarning: undefined,
      syncedUntil: adjustedRange[1],
      stats: undefined,
      resolution,
      hasHourly,
    }
  }
  const syncedUntil = syncInfo?.syncedUntil ?? adjustedRange[1]
  const syncWarning = syncInfo?.syncWarning

  // The stats compare the past day with a week before, so they need days
  const dailyRange: ChartRange =
    resolution === 'hour'
      ? [syncedUntil - 7 * UnixTime.DAY, adjustedRange[1]]
      : adjustedRange
  const entries = await db.activity.getByProjectsAndTimeRange(
    projects,
    dailyRange,
  )

  const firstProjectTimestamp = projectId
    ? activityTotals?.[projectId]?.sinceTimestamp
    : undefined
  const startTimestamp = getChartStartTimestamp({
    rangeStart: dailyRange[0],
    firstProjectTimestamp,
    dataStart: findFirstActivityTimestamp(entries, projectId) ?? 0,
    resolution: 'day',
  })

  const aggregatedEntries = aggregateActivityRecords(entries, {
    startTimestamp,
  })
  if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
    return {
      data: [],
      syncWarning,
      syncedUntil,
      stats: undefined,
      resolution,
      hasHourly,
    }
  }

  const dailyData = toDataPoints(
    generateTimestamps([startTimestamp, adjustedRange[1]], 'day'),
    aggregatedEntries,
    syncedUntil,
    projectId,
  )

  const stats = projectId
    ? getActivityChartStats(
        dailyData,
        syncedUntil,
        maxCounts,
        peaks,
        activityTotals?.[projectId],
      )
    : undefined

  if (resolution === 'day') {
    return {
      data: dailyData,
      syncWarning,
      syncedUntil,
      stats,
      resolution,
      hasHourly,
    }
  }

  // Hours are synced past midnight, unlike the day they belong to. A
  // project's own chart waits for it and for Ethereum, shown beside it,
  // however far behind they are
  const { records: hourlyEntries, window } = await getHourlyActivityRecords(
    projects,
    range,
    projectId ? { waitFor: [projectId, ProjectId.ETHEREUM] } : undefined,
  )
  const lastHour = window.end
  // Hourly data can start after the range does
  const firstHour = hourlyEntries.find((e) =>
    projectId ? e.projectId === projectId : e.projectId !== ProjectId.ETHEREUM,
  )?.timestamp
  return {
    data:
      firstHour === undefined
        ? []
        : toDataPoints(
            generateTimestamps([firstHour, lastHour], 'hour'),
            aggregateActivityRecords(hourlyEntries, {
              startTimestamp: firstHour,
            }) ?? {},
            lastHour,
            projectId,
          ),
    syncWarning,
    syncedUntil: lastHour,
    stats,
    resolution,
    hasHourly,
  }
}

function toDataPoints(
  timestamps: UnixTime[],
  aggregatedEntries: NonNullable<ReturnType<typeof aggregateActivityRecords>>,
  syncedUntil: UnixTime,
  projectId: ProjectId | undefined,
): ActivityChartDataPoint[] {
  return timestamps.map((timestamp) => {
    const isSynced = syncedUntil >= timestamp
    const fallbackValue = isSynced ? 0 : null
    const projectFallback = projectId ? fallbackValue : null

    const entry = aggregatedEntries[timestamp]
    if (!entry || !isSynced) {
      return [
        timestamp,
        projectFallback,
        entry?.ethereumCount ?? fallbackValue,
        projectFallback,
        entry?.ethereumUopsCount ?? fallbackValue,
      ]
    }

    return [
      timestamp,
      entry.count ?? fallbackValue,
      entry.ethereumCount ?? fallbackValue,
      entry.uopsCount ?? fallbackValue,
      entry.ethereumUopsCount ?? fallbackValue,
    ]
  })
}

// Without a single project, the chart aggregates many projects, so any
// non-Ethereum activity marks where it starts.
function findFirstActivityTimestamp(
  entries: Pick<ActivityRecord, 'projectId' | 'timestamp' | 'count'>[],
  projectId: ProjectId | undefined,
): UnixTime | undefined {
  return entries.find(
    (e) =>
      (projectId
        ? e.projectId === projectId
        : e.projectId !== ProjectId.ETHEREUM) && e.count > 0,
  )?.timestamp
}

function getActivityChartStats(
  data: ActivityChartDataPoint[],
  syncedUntil: UnixTime,
  maxCounts:
    | {
        uopsCount: number
        uopsTimestamp: number
        count: number
        countTimestamp: number
      }
    | undefined,
  peaks: ActivityMaxPeaks | undefined,
  totals: ActivityTotals | undefined,
): ActivityProjectChartStats | undefined {
  if (!maxCounts) return undefined

  const currentData = data.find(([timestamp]) => timestamp === syncedUntil)
  const sevenDaysAgoData = data.find(
    ([timestamp]) => timestamp === syncedUntil - 7 * UnixTime.DAY,
  )

  const pastDaySumTps = currentData?.[1] ?? null
  const pastDaySumUops = currentData?.[3] ?? pastDaySumTps
  const sevenDaysAgoTps = sevenDaysAgoData?.[1] ?? 0
  const sevenDaysAgoUops = sevenDaysAgoData?.[3] ?? sevenDaysAgoTps

  return buildActivityProjectChartStats({
    pastDayCount: pastDaySumTps,
    pastDayUopsCount: pastDaySumUops,
    sevenDaysAgoCount: sevenDaysAgoTps,
    sevenDaysAgoUopsCount: sevenDaysAgoUops,
    maxCounts,
    peaks,
    totals,
  })
}

function getMockActivityChart({
  range,
}: ActivityChartParams): ActivityChartData {
  const adjustedRange: [UnixTime, UnixTime] = [range[0] ?? 1590883200, range[1]]
  const timestamps = generateTimestamps(adjustedRange, 'day')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11, 16, 12]),
    syncWarning: undefined,
    syncedUntil: adjustedRange[1],
    stats: undefined,
    resolution: 'day',
    hasHourly: undefined,
  }
}
