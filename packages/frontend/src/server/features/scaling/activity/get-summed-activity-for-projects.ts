import { ProjectId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'

import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import type { TimeRange } from '~/utils/range/range'

export function getSummedActivityForProjects(
  projectIds: string[],
  timeRange: TimeRange,
) {
  if (env.MOCK) {
    return Object.fromEntries(projectIds.map((projectId) => [projectId, 10000]))
  }

  return getCachedSummedActivityForProjects(projectIds, timeRange)
}

const getCachedSummedActivityForProjects = cache(
  async (projectIds: string[], timeRange: TimeRange) => {
    const db = getDb()
    const range = getFullySyncedActivityRange(timeRange)
    const summedCounts =
      await db.activity.getSummedUopsCountForProjectsAndTimeRange(
        projectIds.map(ProjectId),
        range,
      )

    return Object.fromEntries(
      summedCounts.map((record) => [record.projectId, record.uopsCount]),
    )
  },
  ['summed-activity-for-projects'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)
