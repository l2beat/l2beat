import type { Project } from '@l2beat/config'
import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayUops } from './utils/get-last-day'

export async function getActivityLatestUops(projects: Project[]) {
  if (env.MOCK) {
    return getMockActivityLatestUopsData(projects)
  }
  return getActivityLatestUopsData(projects)
}

export type ActivityLatestUopsData = Awaited<
  ReturnType<typeof getActivityLatestUopsData>
>
async function getActivityLatestUopsData(projects: Project[]) {
  const db = getDb()
  // Range here is 1y because we want to match the range of the
  // activity chart on summary page to show relevant data
  const range = getFullySyncedActivityRange('1y')
  const records = await db.activity.getByProjectsAndTimeRange(
    projects.map((p) => p.id),
    range,
  )

  const grouped = groupBy(records, (r) => r.projectId)

  return Object.fromEntries(
    Object.entries(grouped)
      .map(([projectId, records]) => {
        const lastRecord = records.at(-1)
        if (!lastRecord) {
          return undefined
        }
        const pastDayUops = getLastDayUops(records)
        const previousDayUops = getLastDayUops(records, 1)
        return [
          projectId,
          {
            pastDayUops,
            change: calculatePercentageChange(pastDayUops, previousDayUops),
            syncedUntil: lastRecord.timestamp,
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
      { pastDayUops: 5, change: 0.1, syncedUntil: UnixTime.now() },
    ]),
  )
}
