import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { db } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { getActivityProjects } from './utils/get-activity-projects'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
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
    return getMockActivityChartData(...parameters)
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
  const adjustedRange = getFullySyncedActivityRange(range)
  const entries = await db.activity.getByProjectsAndTimeRange(
    projects,
    adjustedRange,
  )

  const startTimestamp = entries.find(
    (e) => e.projectId !== ProjectId.ETHEREUM && e.count > 0,
  )?.timestamp

  if (!startTimestamp) {
    return []
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

  return result
}

function getMockActivityChartData(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
): ActivityChartData {
  const [from, to] = getRangeWithMax(timeRange, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ?? new UnixTime(1590883200),
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return timestamps.map((timestamp) => [+timestamp, 15, 11])
}
