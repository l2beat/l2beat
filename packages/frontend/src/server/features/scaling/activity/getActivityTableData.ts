import type { Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import partition from 'lodash/partition'
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

interface MetricData {
  pastDayCount: {
    value: number
    change: number
  }
  summedCount: {
    value: number
    change: number
  }
  maxCount: {
    value: number
    timestamp: number
  }
}

export type ActivityProjectTableData = {
  tps: MetricData
  uops: MetricData
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
  const [from, to] = await getFullySyncedActivityRange({ type: '30d' })
  assert(from !== null, 'its null')
  const [records, maxCounts, syncMetadataRecords] = await Promise.all([
    db.activity.getByProjectsAndTimeRange(
      [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
      [from - 30 * UnixTime.DAY, to],
    ),

    db.activity.getMaxCountsForProjects(),
    db.syncMetadata.getByFeatureAndIds('activity', [
      ProjectId.ETHEREUM,
      ...projects.map((p) => p.id),
    ]),
  ])

  const [recentRecords, thirtyDaysAgoRecords] = partition(
    records,
    (r) => r.timestamp >= from,
  )

  const grouped = groupBy(recentRecords, (r) => r.projectId)
  const thirtyDaysAgoGrouped = groupBy(thirtyDaysAgoRecords, (r) => r.projectId)

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

      const syncState = getActivitySyncState(syncMetadata, to)
      const syncedUntil = getActivityAdjustedTimestamp(syncState.syncedUntil)
      const pastDayData = records.find((r) => r.timestamp === syncedUntil)
      const sevenDaysAgoData = records.find(
        (r) => r.timestamp === syncedUntil - 7 * UnixTime.DAY,
      )
      const tpsCount = sumTpsCount(records)
      const uopsCount = sumUopsCount(records)
      const thirtyDaysAgoRecords = thirtyDaysAgoGrouped[projectId]

      return [
        projectId,
        {
          tps: {
            pastDayCount: {
              value: countPerSecond(pastDayData?.count ?? 0),
              change: calculatePercentageChange(
                pastDayData?.count ?? 0,
                sevenDaysAgoData?.count ?? 0,
              ),
            },
            summedCount: {
              value: tpsCount,
              change: calculatePercentageChange(
                tpsCount,
                thirtyDaysAgoRecords ? sumTpsCount(thirtyDaysAgoRecords) : 0,
              ),
            },
            maxCount: {
              value: countPerSecond(maxCount.count),
              timestamp: maxCount.countTimestamp,
            },
          },
          uops: {
            pastDayCount: {
              value: countPerSecond(
                pastDayData?.uopsCount ?? pastDayData?.count ?? 0,
              ),
              change: calculatePercentageChange(
                pastDayData?.uopsCount ?? pastDayData?.count ?? 0,
                sevenDaysAgoData?.uopsCount ?? sevenDaysAgoData?.count ?? 0,
              ),
            },
            summedCount: {
              value: uopsCount,
              change: calculatePercentageChange(
                uopsCount,
                thirtyDaysAgoRecords ? sumUopsCount(thirtyDaysAgoRecords) : 0,
              ),
            },
            maxCount: {
              value: countPerSecond(maxCount.uopsCount),
              timestamp: maxCount.uopsTimestamp,
            },
          },
          ratio: getLastDayRatio(
            pastDayData?.uopsCount ?? pastDayData?.count ?? 0,
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
          pastDayCount: {
            value: 19,
            change: Math.random(),
          },
          summedCount: {
            value: 1500,
            change: Math.random(),
          },
          maxCount: {
            value: 30,
            timestamp: UnixTime.now(),
          },
        },
        uops: {
          pastDayCount: {
            value: 20,
            change: Math.random(),
          },
          summedCount: {
            value: 1550,
            change: Math.random(),
          },
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
