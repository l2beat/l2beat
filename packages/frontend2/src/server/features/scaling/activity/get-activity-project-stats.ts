import { UnixTime, type ProjectId } from '@l2beat/shared-pure'
import { db } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { sumActivityCount } from './utils/sum-activity-count'
import { getTpsWeeklyChange } from './utils/get-tps-weekly-change'
import { getLastDayTps } from './utils/get-last-day-tps'
import {
  unstable_noStore as noStore,
  unstable_cache as cache,
} from 'next/cache'

export async function getActivityProjectStats(projectId: ProjectId) {
  noStore()
  return getCachedActivityProjectStats(projectId)
}

const getCachedActivityProjectStats = cache(
  async (projectId: ProjectId) => {
    const range = getFullySyncedActivityRange('30d')
    const counts = await db.activityView.getDailyCountsPerProjectAndTimeRange(
      projectId,
      range,
    )
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
