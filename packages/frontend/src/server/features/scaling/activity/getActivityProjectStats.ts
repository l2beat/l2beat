import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { getActivitySyncState } from '../../utils/syncState'
import { countPerSecond } from './utils/countPerSecond'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getActivityAdjustedTimestamp } from './utils/syncStatus'

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
  const range = await getFullySyncedActivityRange({ type: '30d' })
  const [counts, syncMetadata] = await Promise.all([
    db.activity.getByProjectAndTimeRange(projectId, range),
    db.syncMetadata.getByFeatureAndId('activity', projectId),
  ])
  if (counts.length === 0 || !syncMetadata) {
    return
  }
  const syncState = getActivitySyncState(syncMetadata, range[1])
  const syncedUntil = getActivityAdjustedTimestamp(syncState.syncedUntil)

  const lastDayRecord = counts.find((r) => r.timestamp === syncedUntil)
  const sevenDaysAgoRecord = counts.find(
    (r) => r.timestamp === syncedUntil - 7 * UnixTime.DAY,
  )

  const lastDayUops = lastDayRecord?.uopsCount ?? lastDayRecord?.count ?? 0
  const sevenDaysAgoUops =
    sevenDaysAgoRecord?.uopsCount ?? sevenDaysAgoRecord?.count ?? 0

  return {
    lastDayUops: countPerSecond(lastDayUops),
    uopsWeeklyChange: calculatePercentageChange(lastDayUops, sevenDaysAgoUops),
  }
}

function getMockActivityProjectStatsData(): ActivityProjectStats {
  return {
    lastDayUops: 15,
    uopsWeeklyChange: 0.1,
  }
}
