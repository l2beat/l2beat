import { type Layer2, type Layer3 } from '@l2beat/config'
import { UnixTime, notUndefined } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayUops } from './utils/get-last-day'

export async function getActivityLatestUops(projects: (Layer2 | Layer3)[]) {
  if (env.MOCK) {
    return getMockActivityLatestUopsData(projects)
  }
  return getActivityLatestUopsData(projects)
}

export type ActivityLatestUopsData = Awaited<
  ReturnType<typeof getActivityLatestUopsData>
>
async function getActivityLatestUopsData(projects: (Layer2 | Layer3)[]) {
  const db = getDb()
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
            syncedUntil:
              projectId === 'polygon-pos'
                ? new UnixTime(1723788346)
                : lastRecord.timestamp,
          },
        ] as const
      })
      .filter(notUndefined),
  )
}

function getMockActivityLatestUopsData(
  projects: (Layer2 | Layer3)[],
): ActivityLatestUopsData {
  return Object.fromEntries(
    projects.map((p) => [
      p.id,
      { pastDayUops: 5, change: 0.1, syncedUntil: UnixTime.now() },
    ]),
  )
}
