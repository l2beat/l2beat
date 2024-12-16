import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { aggregateActivityRecords } from './utils/aggregate-activity-records'
import { getActivityProjects } from './utils/get-activity-projects'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getSyncStatus } from './utils/get-sync-status'
import {
  type ActivityProjectFilter,
  createActivityProjectsFilter,
} from './utils/project-filter-utils'
import { type ActivityTimeRange } from './utils/range'

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
  async (filter: ActivityProjectFilter, range: ActivityTimeRange) => {
    const db = getDb()
    const projects = getActivityProjects()
      .filter(createActivityProjectsFilter(filter))
      .map((p) => p.id)
      .concat(ProjectId.ETHEREUM)
    const isSingleProject = projects.length === 2 // Ethereum + 1 other project
    let adjustedRange = getFullySyncedActivityRange(range)
    const entries = await db.activity.getByProjectsAndTimeRange(
      projects,
      adjustedRange,
    )

    // By default, we assume we're always synced...
    let syncStatus = getSyncStatus(adjustedRange[1])

    // ...but if we are looking at a single project, we check the last day we have data for,
    // and use that as the cutoff.
    if (isSingleProject) {
      const lastProjectEntry = entries.findLast((entry) => entry.projectId)
      if (lastProjectEntry) {
        syncStatus = getSyncStatus(lastProjectEntry.timestamp)
        adjustedRange = [adjustedRange[0], lastProjectEntry.timestamp]
      }
    }

    const aggregatedEntries = aggregateActivityRecords(entries)
    if (!aggregatedEntries || Object.values(aggregatedEntries).length === 0) {
      return { data: [], syncStatus }
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
      syncStatus,
    }
  },
  ['activity-chart-data'],
  {
    tags: ['activity'],
  },
)

function getMockActivityChart(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
): ActivityChartData {
  const [from, to] = getRangeWithMax(timeRange, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? new UnixTime(1590883200),
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return {
    data: timestamps.map((timestamp) => [+timestamp, 15, 11, 16, 12]),
    syncStatus: getSyncStatus(adjustedRange[1]),
  }
}
