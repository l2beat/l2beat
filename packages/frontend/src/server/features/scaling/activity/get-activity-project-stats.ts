import { type ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { db } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps } from './utils/get-last-day-tps'
import { getTpsWeeklyChange } from './utils/get-tps-weekly-change'
import { sumActivityCount } from './utils/sum-activity-count'

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
}

function getMockActivityProjectStatsData(): ActivityProjectStats {
  return {
    lastDayTps: 15,
    txCount: 1500,
    tpsWeeklyChange: 0.1,
  }
}
