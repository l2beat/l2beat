import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { optionToRange } from '~/utils/range/range'
import { countPerSecond } from './utils/countPerSecond'
import { getActivitySyncInfo } from './utils/getActivitySyncInfo'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export async function getActivityProjectStats(projectId: ProjectId) {
  if (env.MOCK) {
    return getMockActivityProjectStatsData()
  }

  return await getActivityProjectStatsData(projectId)
}

type ActivityProjectStats = Awaited<
  ReturnType<typeof getActivityProjectStatsData>
>
/**
 * Reads the project's own last synced day, like the Activity section's stats
 * do, so a project that stopped syncing shows its last value with a warning
 * instead of nothing.
 */
async function getActivityProjectStatsData(projectId: ProjectId) {
  const db = getDb()
  const [, rangeEnd] = await getFullySyncedActivityRange(optionToRange('30d'))
  const { syncedUntil, syncWarning, hasSyncData } = await getActivitySyncInfo(
    projectId,
    rangeEnd,
  )
  if (!hasSyncData) {
    return
  }
  const counts = await db.activity.getByProjectAndTimeRange(projectId, [
    syncedUntil - 7 * UnixTime.DAY,
    syncedUntil,
  ])
  if (counts.length === 0) {
    return
  }

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
    uopsWeeklyChangePeriod: '7D' as const,
    syncWarning,
  }
}

function getMockActivityProjectStatsData(): ActivityProjectStats {
  return {
    lastDayUops: 15,
    uopsWeeklyChange: 0.1,
    uopsWeeklyChangePeriod: '7D',
    syncWarning: undefined,
  }
}
