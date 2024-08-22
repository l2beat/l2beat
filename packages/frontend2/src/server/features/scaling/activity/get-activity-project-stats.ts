import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { db } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps } from './utils/get-last-day-tps'
import { getTpsWeeklyChange } from './utils/get-tps-weekly-change'
import { sumActivityCount } from './utils/sum-activity-count'

export async function getActivityProjectStats(projectId: ProjectId) {
  noStore()
  return getCachedActivityProjectStats(projectId)
}

const getCachedActivityProjectStats = cache(
  async (projectId: ProjectId) => {
    const range = getFullySyncedActivityRange('30d')
    const counts = await db.activity.getByProjectAndTimeRange(projectId, range)
    if (counts.length === 0) {
      return
    }
    const summed = sumActivityCount(counts)

    return {
      txCount: summed,
      lastDayTps: getLastDayTps(counts),
      tpsWeeklyChange: getTpsWeeklyChange(counts),
    }
  },
  ['activityProjectStats'],
  {
    revalidate: 6 * UnixTime.HOUR,
  },
)
