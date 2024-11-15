import { type Layer2, type Layer3, layer2s, layer3s } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { db } from '~/server/database'
import { countToTps } from './utils/count-to-tps'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps } from './utils/get-last-day-tps'
import { getSyncStatus } from './utils/get-sync-status'
import { getTpsWeeklyChange } from './utils/get-tps-weekly-change'
import { sumActivityCount } from './utils/sum-activity-count'

export async function getActivityTable(projects: (Layer2 | Layer3)[]) {
  if (env.MOCK) {
    return getMockActivityTableData()
  }
  return getActivityTableData(projects)
}

export type ActivityProjectTableData = NonNullable<ActivityTableData[string]>
type ActivityTableData = Awaited<ReturnType<typeof getActivityTableData>>

async function getActivityTableData(projects: (Layer2 | Layer3)[]) {
  const range = getFullySyncedActivityRange('30d')
  const records = await db.activity.getByProjectsAndTimeRange(
    [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
    range,
  )
  const maxCounts = await db.activity.getMaxCountForProjects()

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
          change: getTpsWeeklyChange(records),
          pastDayTps: getLastDayTps(records),
          maxTps: {
            value: countToTps(maxCount.count),
            timestamp: maxCount.timestamp.toNumber(),
          },
          summedCount: sumActivityCount(records),
          syncStatus: getSyncStatus(lastRecord.timestamp),
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
        change: Math.random(),
        pastDayTps: 20,
        maxTps: {
          value: 30,
          timestamp: UnixTime.now().toNumber(),
        },
        summedCount: 1500,
        syncStatus: getSyncStatus(UnixTime.now()),
      },
    ]),
  )
}
