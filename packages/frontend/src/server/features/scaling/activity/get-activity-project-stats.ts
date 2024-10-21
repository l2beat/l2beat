import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import {
  unstable_cache as cache,
  unstable_noStore as noStore,
} from 'next/cache'
import { env } from '~/env'
import { db } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayUops } from './utils/get-last-day-uops'
import { getUopsWeeklyChange } from './utils/get-uops-weekly-change'
import { sumActivityCount } from './utils/sum-activity-count'

export async function getActivityProjectStats(projectId: ProjectId) {
  if (env.MOCK) {
    return getMockActivityProjectStats()
  }
  noStore()
  return getCachedActivityProjectStats(projectId)
}

export type ActivityProjectStats = Awaited<
  ReturnType<typeof getCachedActivityProjectStats>
>
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
      lastDayTps: getLastDayUops(counts),
      tpsWeeklyChange: getUopsWeeklyChange(counts),
    }
  },
  ['activityProjectStats'],
  {
    revalidate: 6 * UnixTime.HOUR,
  },
)

function getMockActivityProjectStats(): ActivityProjectStats {
  return {
    lastDayTps: 15,
    txCount: 1500,
    tpsWeeklyChange: 0.1,
  }
}
