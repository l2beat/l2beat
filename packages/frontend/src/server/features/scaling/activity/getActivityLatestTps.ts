import type { Project } from '@l2beat/config'
import { notUndefined, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { getActivitySyncState, type SyncState } from '../../utils/syncState'
import { countPerSecond } from './utils/countPerSecond'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getActivityAdjustedTimestamp } from './utils/syncStatus'

export type ActivityLatestUopsData = Record<
  string,
  {
    pastDayUops: number
    change: number
    syncState: SyncState
  }
>

export async function getActivityLatestUops(
  projects: Project[],
  range?: { type: 'custom'; from: UnixTime; to: UnixTime },
): Promise<ActivityLatestUopsData> {
  if (env.MOCK) {
    return getMockActivityLatestUopsData(projects)
  }

  const db = getDb()
  // Range here is 1y because we want to match the range of the
  // activity chart on summary page to show relevant data
  const timeRange = await getFullySyncedActivityRange(range ?? { type: '1y' })
  const [records, syncMetadataRecords] = await Promise.all([
    db.activity.getByProjectsAndTimeRange(
      projects.map((p) => p.id),
      timeRange,
    ),
    db.syncMetadata.getByFeatureAndIds(
      'activity',
      projects.map((p) => p.id),
    ),
  ])

  const grouped = groupBy(records, (r) => r.projectId)

  return Object.fromEntries(
    Object.entries(grouped)
      .map(([projectId, records]) => {
        const lastRecord = records.at(-1)
        if (!lastRecord) {
          return undefined
        }
        const syncMetadata = syncMetadataRecords.find((r) => r.id === projectId)
        if (!syncMetadata) {
          return undefined
        }
        const syncState = getActivitySyncState(syncMetadata, timeRange[1])
        const syncedUntil = getActivityAdjustedTimestamp(syncState.syncedUntil)

        const pastDayRecord = records.find((r) => r.timestamp === syncedUntil)
        const sevenDaysAgoRecord = records.find(
          (r) => r.timestamp === syncedUntil - 7 * UnixTime.DAY,
        )
        const pastDayUops = countPerSecond(
          pastDayRecord?.uopsCount ?? pastDayRecord?.count ?? 0,
        )
        const sevenDaysAgoUops = countPerSecond(
          sevenDaysAgoRecord?.uopsCount ?? sevenDaysAgoRecord?.count ?? 0,
        )
        return [
          projectId,
          {
            pastDayUops,
            change: calculatePercentageChange(pastDayUops, sevenDaysAgoUops),
            syncState,
          },
        ] as const
      })
      .filter(notUndefined),
  )
}

function getMockActivityLatestUopsData(
  projects: Project[],
): ActivityLatestUopsData {
  return Object.fromEntries(
    projects.map((p) => [
      p.id,
      {
        pastDayUops: 5,
        change: 0.1,
        syncState: {
          isSynced: true,
          syncedUntil: UnixTime.now(),
          target: UnixTime.now(),
        },
      },
    ]),
  )
}
