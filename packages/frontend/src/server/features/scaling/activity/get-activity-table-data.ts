import type { Project } from '@l2beat/config'
import { layer2s, layer3s } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
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
  return getActivityTableData(projects)
}

export type ActivityProjectTableData = NonNullable<ActivityTableData[string]>
type ActivityTableData = Awaited<ReturnType<typeof getActivityTableData>>

async function getActivityTableData(projects: Project[]) {
  const db = getDb()
  const range = getFullySyncedActivityRange('max')
  const records = await db.activity.getByProjectsAndTimeRange(
    [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
    range,
  )
  const maxCounts = await db.activity.getMaxCountsForProjects()

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
            summedCount: sumTpsCount(records.slice(-30)),
            maxCount: {
              value: countPerSecond(maxCount.count),
              timestamp: maxCount.countTimestamp.toNumber(),
            },
          },
          uops: {
            change: getUopsWeeklyChange(records),
            pastDayCount: getLastDayUops(records),
            summedCount: sumUopsCount(records.slice(-30)),
            maxCount: {
              value: countPerSecond(maxCount.uopsCount),
              timestamp: maxCount.uopsTimestamp.toNumber(),
            },
          },
          ratio: getLastDayRatio(records),
          syncedUntil: lastRecord.timestamp,
        },
      ]
    }),
  )

  return Object.fromEntries(Object.entries(data).filter(([_, value]) => value))
}

function getMockActivityTableData(): ActivityTableData {
  const projects = [
    { id: ProjectId.ETHEREUM },
    ...layer2s.filter((l2) => !l2.isArchived && !l2.isUpcoming),
    ...layer3s.filter((l3) => !l3.isUpcoming),
  ]

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
            timestamp: UnixTime.now().toNumber(),
          },
        },
        uops: {
          change: Math.random(),
          pastDayCount: 20,
          summedCount: 1550,
          maxCount: {
            value: 30,
            timestamp: UnixTime.now().add(-1, 'days').toNumber(),
          },
        },
        ratio: 1.1,
        syncedUntil: UnixTime.now(),
      },
    ]),
  )
}
