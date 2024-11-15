import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { db } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
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
 * @returns [timestamp, projectsTxCount, ethereumTxCount][] - all numbers
 */
export function getActivityChart(
  ...parameters: Parameters<typeof getActivityChartData>
) {
  if (env.MOCK) {
    return getMockActivityChart(...parameters)
  }
  return getActivityChartData(...parameters)
}

export type ActivityChartData = Awaited<ReturnType<typeof getActivityChartData>>

async function getActivityChartData(
  filter: ActivityProjectFilter,
  range: ActivityTimeRange,
) {
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

  const startTimestamp = entries.find(
    (e) => e.projectId !== ProjectId.ETHEREUM && e.count > 0,
  )?.timestamp

  if (!startTimestamp) {
    return { data: [], syncStatus }
  }

  const startIndex = entries.findIndex(
    (e) => e.timestamp.toNumber() === startTimestamp.toNumber(),
  )

  const aggregatedEntries = entries.slice(startIndex).reduce(
    (acc, entry) => {
      const timestamp = entry.timestamp.toNumber()
      const isEthereum = entry.projectId === ProjectId.ETHEREUM

      if (!acc[timestamp]) {
        acc[timestamp] = {
          timestamp: entry.timestamp,
          count: 0,
          ethereumCount: 0,
        }
      }

      if (isEthereum) {
        acc[timestamp].ethereumCount += entry.count
      } else {
        acc[timestamp].count += entry.count
      }

      return acc
    },
    {} as Record<
      number,
      { timestamp: UnixTime; count: number; ethereumCount: number }
    >,
  )
  const timestamps = generateTimestamps(
    [startTimestamp, adjustedRange[1]],
    'daily',
  )
  const result: [number, number, number][] = timestamps.map((timestamp) => {
    const entry = aggregatedEntries[timestamp.toNumber()]
    if (!entry) {
      return [+timestamp, 0, 0]
    }
    return [+timestamp, entry.count, entry.ethereumCount]
  })

  return {
    data: result,
    syncStatus,
  }
}

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
    data: timestamps.map((timestamp) => [+timestamp, 15, 11]),
    syncStatus: getSyncStatus(adjustedRange[1]),
  }
}
