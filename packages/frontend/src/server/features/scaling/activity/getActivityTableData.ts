import type { Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { getActivitySyncState, type SyncState } from '../../utils/syncState'
import { countPerSecond } from './utils/countPerSecond'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getLastDayRatio } from './utils/getLastDayRatio'
import { sumTpsCount, sumUopsCount } from './utils/sumActivityCount'
import { getActivityAdjustedTimestamp } from './utils/syncStatus'

export type ActivityProjectTableData = {
  tps: {
    change: number
    pastDayCount: number
    summedCount: number
    maxCount: {
      value: number
      timestamp: number
    }
  }
  uops: {
    change: number
    pastDayCount: number
    summedCount: number
    maxCount: {
      value: number
      timestamp: number
    }
  }
  ratio: number
  syncState: SyncState
}
type ActivityTableData = Record<string, ActivityProjectTableData | undefined>

export async function getActivityTable(
  projects: Project[],
): Promise<ActivityTableData> {
  if (env.MOCK) {
    return getMockActivityTableData()
  }

  const db = getDb()
  const range = await getFullySyncedActivityRange({ type: '30d' })
  const [records, maxCounts, syncMetadataRecords] = await Promise.all([
    db.activity.getByProjectsAndTimeRange(
      [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
      range,
    ),
    db.activity.getMaxCountsForProjects(),
    db.syncMetadata.getByFeatureAndIds('activity', [
      ProjectId.ETHEREUM,
      ...projects.map((p) => p.id),
    ]),
  ])

  const grouped = groupBy(records, (r) => r.projectId)

  const data = Object.fromEntries(
    Object.entries(grouped).map(([projectId, records]) => {
      const lastRecord = records.at(-1)

      if (!lastRecord) {
        return [projectId, undefined]
      }

      const maxCount = maxCounts[projectId]
      assert(
        maxCount !== undefined,
        `Max count for project ${projectId} not found`,
      )

      const syncMetadata = syncMetadataRecords.find((r) => r.id === projectId)
      if (!syncMetadata) {
        return [projectId, undefined]
      }

      const syncState = getActivitySyncState(syncMetadata, range[1])
      const syncedUntil = getActivityAdjustedTimestamp(syncState.syncedUntil)
      const pastDayData = records.find((r) => r.timestamp === syncedUntil)
      const sevenDaysAgoData = records.find(
        (r) => r.timestamp === syncedUntil - 7 * UnixTime.DAY,
      )

      return [
        projectId,
        {
          tps: {
            pastDayCount: countPerSecond(pastDayData?.count ?? 0),
            change: calculatePercentageChange(
              pastDayData?.count ?? 0,
              sevenDaysAgoData?.count ?? 0,
            ),
            summedCount: sumTpsCount(records),
            maxCount: {
              value: countPerSecond(maxCount.count),
              timestamp: maxCount.countTimestamp,
            },
          },
          uops: {
            pastDayCount: countPerSecond(pastDayData?.uopsCount ?? 0),
            summedCount: sumUopsCount(records),
            change: calculatePercentageChange(
              pastDayData?.uopsCount ?? 0,
              sevenDaysAgoData?.uopsCount ?? 0,
            ),
            maxCount: {
              value: countPerSecond(maxCount.uopsCount),
              timestamp: maxCount.uopsTimestamp,
            },
          },
          ratio: getLastDayRatio(
            pastDayData?.uopsCount ?? 0,
            pastDayData?.count ?? 0,
          ),
          syncState,
        },
      ]
    }),
  )

  return data
}

async function getMockActivityTableData(): Promise<ActivityTableData> {
  const projects = await ps.getProjects({
    where: ['activityConfig'],
    whereNot: ['archivedAt', 'isUpcoming'],
  })

  return Object.fromEntries(
    projects.map((project) => [
      project.id,
      {
        tps: {
          change: Math.random(),
          pastDayCount: 19,
          summedCount: 1500,
          maxCount: {
            value: 30,
            timestamp: UnixTime.now(),
          },
        },
        uops: {
          change: Math.random(),
          pastDayCount: 20,
          summedCount: 1550,
          maxCount: {
            value: 30,
            timestamp: UnixTime.now() - 1 * UnixTime.DAY,
          },
        },
        ratio: 1.1,
        syncState: {
          isSynced: true,
          syncedUntil: UnixTime.now(),
          target: UnixTime.now(),
        },
      },
    ]),
  )
}
