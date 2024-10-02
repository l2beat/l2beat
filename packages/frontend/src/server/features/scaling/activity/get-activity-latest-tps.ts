import { type Layer2, type Layer3 } from '@l2beat/config'
import { groupBy } from 'lodash'
import { db } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps } from './utils/get-last-day-tps'

export async function getActivityLatestTps(projects: (Layer2 | Layer3)[]) {
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

      const change = pastDayTps / previousDayTps - 1
      return [
        projectId,
        {
          pastDayTps,
          change,
        },
      ]
    }),
  )
}
