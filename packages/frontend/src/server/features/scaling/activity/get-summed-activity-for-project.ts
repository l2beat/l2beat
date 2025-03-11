import { ProjectId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'

import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import type { TimeRange } from '~/utils/range/range'

export function getSummedActivityForProject(
  projectId: string,
  timeRange: TimeRange,
) {
  if (env.MOCK) {
    return 10000
  }

  return getCachedSummedActivityForProject(projectId, timeRange)
}

const getCachedSummedActivityForProject = cache(
  async (projectId: string, timeRange: TimeRange) => {
    const db = getDb()
    const range = getFullySyncedActivityRange(timeRange)
    return db.activity.getSummedUopsCountForProjectAndTimeRange(
      ProjectId(projectId),
      range,
    )
  },
  ['summed-activity-for-project'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)
