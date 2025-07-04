import type { Project } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { countPerSecond } from './utils/countPerSecond'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'
import { getLastDayTps, getLastDayUops } from './utils/getLastDay'
import { getLastDayRatio } from './utils/getLastDayRatio'
import {
  getTpsWeeklyChange,
  getUopsWeeklyChange,
} from './utils/getWeeklyChange'
import { sumTpsCount, sumUopsCount } from './utils/sumActivityCount'

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
  syncedUntil: number
}
type ActivityTableData = Record<string, ActivityProjectTableData | undefined>

export async function getActivityTable(
  projects: Project[],
): Promise<ActivityTableData> {
  if (env.MOCK) {
    return getMockActivityTableData()
  }

  const db = getDb()
  const range = getFullySyncedActivityRange({ type: '30d' })
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
        syncedUntil: UnixTime.now(),
      },
    ]),
  )
}
