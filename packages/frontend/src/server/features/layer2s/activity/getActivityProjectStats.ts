import type { ActivityRecord, SyncMetadataRecord } from '@l2beat/database'
import { type ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { FrontendInMemoryCache } from '~/utils/FrontendInMemoryCache'
import { optionToRange } from '~/utils/range/range'
import { getActivitySyncState } from '../../utils/syncState'
import { countPerSecond } from './utils/countPerSecond'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getActivityAdjustedTimestamp } from './utils/syncStatus'

const cache = new FrontendInMemoryCache('getActivityProjectStats')

export async function getActivityProjectStats(projectId: ProjectId) {
  if (env.MOCK) {
    return getMockActivityProjectStatsData()
  }

  // Pages render together, so they share one read of every project.
  const stats = await cache.get(
    { key: ['activity-project-stats'], ttl: 5 * 60 },
    getAllActivityProjectStats,
  )
  return stats.get(projectId)
}

interface ActivityProjectStats {
  lastDayUops: number
  uopsWeeklyChange: number
  uopsWeeklyChangePeriod: '7D'
}

async function getAllActivityProjectStats(): Promise<
  Map<string, ActivityProjectStats>
> {
  const db = getDb()
  // Only scaling project pages show these stats
  const projects = await ps.getProjects({ select: ['scalingInfo'] })
  const projectIds = projects.map((p) => p.id)
  const range = await getFullySyncedActivityRange(optionToRange('30d'))
  const [counts, syncMetadata] = await Promise.all([
    db.activity.getByProjectsAndTimeRange(projectIds, range),
    db.syncMetadata.getByFeatureAndIds('activity', projectIds),
  ])
  const countsByProject = groupBy(counts, (c) => c.projectId)

  const stats = new Map<string, ActivityProjectStats>()
  for (const metadata of syncMetadata) {
    const projectCounts = countsByProject[metadata.id]
    if (!projectCounts) {
      continue
    }
    stats.set(metadata.id, toStats(projectCounts, metadata, range[1]))
  }
  return stats
}

function toStats(
  counts: ActivityRecord[],
  syncMetadata: SyncMetadataRecord,
  to: UnixTime,
): ActivityProjectStats {
  const syncState = getActivitySyncState(syncMetadata, to)
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
    uopsWeeklyChangePeriod: '7D',
  }
}

function getMockActivityProjectStatsData(): ActivityProjectStats {
  return {
    lastDayUops: 15,
    uopsWeeklyChange: 0.1,
    uopsWeeklyChangePeriod: '7D',
  }
}
