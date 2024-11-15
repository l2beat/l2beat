import { type Layer2, type Layer3 } from '@l2beat/config'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { db } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps } from './utils/get-last-day-tps'

export async function getActivityLatestTps(projects: (Layer2 | Layer3)[]) {
  if (env.MOCK) {
    return getMockActivityLatestTpsData(projects)
  }
  return getActivityLatestTpsData(projects)
}

export type ActivityLatestTpsData = Awaited<
  ReturnType<typeof getActivityLatestTpsData>
>
async function getActivityLatestTpsData(projects: (Layer2 | Layer3)[]) {
  const range = getFullySyncedActivityRange('2d')
  const records = await db.activity.getByProjectsAndTimeRange(
    projects.map((p) => p.id),
    range,
  )

  const grouped = groupBy(records, (r) => r.projectId)

  return Object.fromEntries(
    Object.entries(grouped).map(([projectId, records]) => {
      const pastDayTps = getLastDayTps(records)
      const previousDayTps = getLastDayTps(records, 1)
      return [
        projectId,
        {
          pastDayTps,
          change: calculatePercentageChange(pastDayTps, previousDayTps),
        },
      ]
    }),
  )
}

function getMockActivityLatestTpsData(
  projects: (Layer2 | Layer3)[],
): ActivityLatestTpsData {
  return Object.fromEntries(
    projects.map((p) => [p.id, { pastDayTps: 5, change: 0.1 }]),
  )
}
