import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { MIN_TIMESTAMPS } from '~/consts/min-timestamps'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { aggregateActivityRecords } from './utils/aggregate-activity-records'
import { getActivityProjects } from './utils/get-activity-projects'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getActivitySyncWarning } from './utils/is-activity-synced'
import type { ActivityProjectFilter } from './utils/project-filter-utils'
import { createActivityProjectsFilter } from './utils/project-filter-utils'
import type { ActivityTimeRange } from './utils/range'

/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, projectsTxCount, ethereumTxCount, projectsUopsCount, ethereumUopsCount][] - all numbers
 */
export function getActivityChart(
  ...parameters: Parameters<typeof getCachedActivityChartData>
) {
  if (env.MOCK) {
    return getMockActivityChart(...parameters)
  }
  return getCachedActivityChartData(...parameters)
}

export type ActivityChartData = Awaited<
  ReturnType<typeof getCachedActivityChartData>
>

export const getCachedActivityChartData = cache(
  async (
    filter: ActivityProjectFilter,
    range: ActivityTimeRange,
    previewRecategorisation: boolean,
  ) => {
    const db = getDb()
    const projects = getActivityProjects()
      .filter(createActivityProjectsFilter(filter, previewRecategorisation))
      .map((p) => p.id)
      .concat(ProjectId.ETHEREUM)
    const isSingleProject = projects.length === 2 // Ethereum + 1 other project
    let adjustedRange = getFullySyncedActivityRange(range)
    const entries = await db.activity.getByProjectsAndTimeRange(
      projects,
      adjustedRange,
    )

    // By default, we assume we're always synced...
    let syncedUntil = adjustedRange[1]
    let syncWarning = getActivitySyncWarning(syncedUntil)

    // ...but if we are looking at a single project, we check the last day we have data for,
    // and use that as the cutoff.
    if (isSingleProject) {
      const lastProjectEntry = entries.findLast((entry) => entry.projectId)
      if (lastProjectEntry) {
        syncedUntil = lastProjectEntry.timestamp
        syncWarning = getActivitySyncWarning(syncedUntil)
        adjustedRange = [adjustedRange[0], lastProjectEntry.timestamp]
      }
    }

    const aggregatedEntries = aggregateActivityRecords(entries)
    if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
      return { data: [], syncWarning, syncedUntil: syncedUntil.toNumber() }
    }

    const startTimestamp = Math.min(
      ...Object.keys(aggregatedEntries).map(Number),
    )
    const timestamps = generateTimestamps(
      [new UnixTime(startTimestamp), adjustedRange[1]],
      'daily',
    )

    const data: [number, number, number, number, number][] = timestamps.map(
      (timestamp) => {
        const entry = aggregatedEntries[timestamp.toNumber()]
        if (!entry) {
          return [+timestamp, 0, 0, 0, 0]
        }
        return [
          +timestamp,
          entry.count,
          entry.ethereumCount,
          entry.uopsCount,
          entry.ethereumUopsCount,
        ]
      },
    )
    return {
      data,
      syncWarning,
      syncedUntil: syncedUntil.toNumber(),
    }
  },
  ['activity-chart-data'],
  {
    tags: ['hourly-data'],
    revalidate: UnixTime.HOUR,
  },
)

function getMockActivityChart(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
  __: boolean,
): ActivityChartData {
  const [from, to] = getRangeWithMax(timeRange, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? MIN_TIMESTAMPS.activity,
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11, 16, 12]),
    syncWarning: getActivitySyncWarning(adjustedRange[1]),
    syncedUntil: adjustedRange[1].toNumber(),
  }
}
