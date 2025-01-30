import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayUops } from './utils/get-last-day'
import { getUopsWeeklyChange } from './utils/get-weekly-change'
import { sumUopsCount } from './utils/sum-activity-count'

export async function getActivityProjectStats(projectId: ProjectId) {
  if (env.MOCK) {
    return getMockActivityProjectStatsData()
  }

  return getActivityProjectStatsData(projectId)
}

type ActivityProjectStats = Awaited<
  ReturnType<typeof getActivityProjectStatsData>
>
async function getActivityProjectStatsData(projectId: ProjectId) {
  const db = getDb()
  const range = getFullySyncedActivityRange('30d')
  const counts = await db.activity.getByProjectAndTimeRange(projectId, range)
  if (counts.length === 0) {
    return
  }
  const summed = sumUopsCount(counts)

  return {
    uopsCount: summed,
    lastDayUops: getLastDayUops(counts),
    uopsWeeklyChange: getUopsWeeklyChange(counts),
  }
}

function getMockActivityProjectStatsData(): ActivityProjectStats {
  return {
    lastDayUops: 15,
    uopsCount: 1500,
    uopsWeeklyChange: 0.1,
  }
}
