import { assert, UnixTime } from '@l2beat/shared-pure'
import _ from 'lodash'
import { countPerSecond } from './count-per-second'
import { getLastDayTps, getLastDayUops } from './get-last-day'
import { getLastDayRatio } from './get-last-day-ratio'
import { getTpsWeeklyChange, getUopsWeeklyChange } from './get-weekly-change'
import { getDb } from './getDb'
import { sumTpsCount, sumUopsCount } from './sum-activity-count'

export async function getActivityProjectsData() {
  const db = getDb()
  const records = await db.activity.getByTimeRange([
    UnixTime.now().toStartOf('day').add(-30, 'days'),
    UnixTime.now().toStartOf('day').add(-1, 'seconds'),
  ])
  const maxCounts = await db.activity.getMaxCountsForProjects()

  const grouped = _.groupBy(records, (r) => r.projectId)

  const data = Object.fromEntries(
    Object.entries(grouped)
      .map(([projectId, records]) => {
        const lastRecord = records.at(-1)

        if (!lastRecord) {
          return [projectId, undefined] as const
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
                timestamp: maxCount.countTimestamp.toNumber(),
              },
            },
            uops: {
              change: getUopsWeeklyChange(records),
              pastDayCount: getLastDayUops(records),
              summedCount: sumUopsCount(records),
              maxCount: {
                value: countPerSecond(maxCount.uopsCount),
                timestamp: maxCount.uopsTimestamp.toNumber(),
              },
            },
            ratio: getLastDayRatio(records),
          },
        ] as const
      })
      .filter((e) => e[1] !== undefined),
  )

  return data
}
