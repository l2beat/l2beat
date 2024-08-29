import { type Layer2, type Layer3 } from '@l2beat/config'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { db } from '~/server/database'
import { countToTps } from './utils/count-to-tps'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'
import { getLastDayTps } from './utils/get-last-day-tps'
import { getTpsWeeklyChange } from './utils/get-tps-weekly-change'
import { sumActivityCount } from './utils/sum-activity-count'

export type ActivityTableData = NonNullable<
  Awaited<ReturnType<typeof getActivityTableData>>[string]
>

export async function getActivityTableData(projects: (Layer2 | Layer3)[]) {
  const [start, end] = getFullySyncedActivityRange('30d')
  // We already subtract 1 day from the start to get data for change calculation in `getFullySyncedActivityRange`
  const adjustedRange: [UnixTime, UnixTime] = [start, end]
  const records = await db.activity.getByProjectsAndTimeRange(
    [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
    adjustedRange,
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

  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null),
  )
}

function getSyncStatus(syncedUntil: UnixTime) {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  return { isSynced, syncedUntil: syncedUntil.toNumber() }
}
