import type { ProjectId } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getLastDayUops } from './utils/getLastDay'
import { getUopsWeeklyChange } from './utils/getWeeklyChange'

export async function getActivityProjectStats(projectId: ProjectId) {
  if (env.MOCK) {
    return getMockActivityProjectStatsData()
  }

  return await getActivityProjectStatsData(projectId)
}

type ActivityProjectStats = Awaited<
  ReturnType<typeof getActivityProjectStatsData>
>
async function getActivityProjectStatsData(projectId: ProjectId) {
  const db = getDb()
  const range = getFullySyncedActivityRange({ type: '30d' })
  const counts = await db.activity.getByProjectAndTimeRange(projectId, range)
  if (counts.length === 0) {
    return
  }

  return {
    lastDayUops: getLastDayUops(counts),
    uopsWeeklyChange: getUopsWeeklyChange(counts),
  }
}

function getMockActivityProjectStatsData(): ActivityProjectStats {
  return {
    lastDayUops: 15,
    uopsWeeklyChange: 0.1,
  }
}
