import type { Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { countPerSecond } from './utils/count-per-second'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps, getLastDayUops } from './utils/get-last-day'
import { getLastDayRatio } from './utils/get-last-day-ratio'
import {
  getTpsWeeklyChange,
  getUopsWeeklyChange,
} from './utils/get-weekly-change'
import { sumTpsCount, sumUopsCount } from './utils/sum-activity-count'

export async function getActivityTable(projects: Project[]) {
  if (env.MOCK) {
    return getMockActivityTableData()
  }

  return getCachedActivityTableData(projects)
}

export type ActivityProjectTableData = NonNullable<ActivityTableData[string]>
type ActivityTableData = Awaited<ReturnType<typeof getCachedActivityTableData>>

const getCachedActivityTableData = cache(
  async (projects: Project[]) => {
    const db = getDb()
    const range = getFullySyncedActivityRange('30d')
    const [records, maxCounts] = await Promise.all([
      db.activity.getByProjectsAndTimeRange(
        [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
        range,
      ),
      db.activity.getMaxCountsForProjects(),
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

        return [
          projectId,
          {
            tps: {
              change: getTpsWeeklyChange(records),
              pastDayCount: getLastDayTps(records),
              summedCount: sumTpsCount(records),
              maxCount: {
                value: countPerSecond(maxCount.count),
                timestamp: maxCount.countTimestamp,
              },
            },
            uops: {
              change: getUopsWeeklyChange(records),
              pastDayCount: getLastDayUops(records),
              summedCount: sumUopsCount(records),
              maxCount: {
                value: countPerSecond(maxCount.uopsCount),
                timestamp: maxCount.uopsTimestamp,
              },
            },
            ratio: getLastDayRatio(records),
            syncedUntil: lastRecord.timestamp,
          },
        ]
      }),
    )

    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value),
    )
  },
  [`activity-table-data`],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

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
        syncedUntil: UnixTime.now(),
      },
    ]),
  )
}
