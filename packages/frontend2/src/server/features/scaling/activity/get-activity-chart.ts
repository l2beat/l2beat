import { layer2s, layer3s } from '@l2beat/config'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import {
  type ActivityProjectFilter,
  createActivityProjectsFilter,
} from './utils/project-filter-utils'
import { type ActivityTimeRange } from './utils/range'

export function getActivityChart(
  ...parameters: Parameters<typeof getCachedActivityChart>
) {
  noStore()
  return getCachedActivityChart(...parameters)
}

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
    const aggregatedEntries = entries.reduce(
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

    return {
      types: ['timestamp', 'count', 'ethereumCount'] as const,
      data: result,
    }
  },
  ['activityChartV2'],
  { revalidate: UnixTime.HOUR },
)
