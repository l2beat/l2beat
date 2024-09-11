import { layer2s, layer3s } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { getRangeWithMax } from '~/utils/range/range'
import { generateTimestamps } from '../../utils/generate-timestamps'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import {
  type ActivityProjectFilter,
  createActivityProjectsFilter,
} from './utils/project-filter-utils'
import { type ActivityTimeRange } from './utils/range'

/**
 * A function that computes values for chart data of the activity over time.
 * @returns [timestamp, count, ethereumCount][] - all numbers
 */
export function getActivityChart(
  ...parameters: Parameters<typeof getCachedActivityChart>
) {
  if (env.MOCK) {
    return getMockActivityChart(...parameters)
  }
  noStore()
  return getCachedActivityChart(...parameters)
}

export type ActivityChartData = Awaited<
  ReturnType<typeof getCachedActivityChart>
>
const getCachedActivityChart = cache(
  async (filter: ActivityProjectFilter, range: ActivityTimeRange) => {
    const projects = [...layer2s, ...layer3s]
      .filter(createActivityProjectsFilter(filter))
      .map((p) => p.id)
      .concat(ProjectId.ETHEREUM)

    const entries = await db.activity.getByProjectsAndTimeRange(
      projects,
      getFullySyncedActivityRange(range),
    )

    const startIndex = entries.findIndex(
      (e) => e.projectId !== ProjectId.ETHEREUM && e.count > 0,
    )

    if (startIndex === -1) {
      return []
    }

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

    const result = Object.values(aggregatedEntries)
      .sort((a, b) => a.timestamp.toNumber() - b.timestamp.toNumber())
      .map(
        ({ timestamp, count, ethereumCount }) =>
          [
            +timestamp,
            count / UnixTime.DAY,
            ethereumCount / UnixTime.DAY,
          ] as const,
      )

    return result
  },
  ['activityChart'],
  { revalidate: UnixTime.HOUR },
)

function getMockActivityChart(
  _: ActivityProjectFilter,
  timeRange: ActivityTimeRange,
): ActivityChartData {
  const [from, to] = getRangeWithMax(timeRange, 'daily')
  const adjustedRange: [UnixTime, UnixTime] = [
    from ? from : new UnixTime(1590883200),
    to,
  ]
  const timestamps = generateTimestamps(adjustedRange, 'daily')

  return timestamps.map((timestamp) => [+timestamp, 15, 11])
}
