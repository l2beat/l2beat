import { type DailyTransactionCountRecord } from '@l2beat/database'
import { assert, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { db } from '~/server/database'
import {
  type ActivityTimeRange,
  getFullySyncedActivityRange,
} from './utils/range'
import { getActivityProjects } from './get-activity-projects'

export async function getActivityTableData(timeRange: ActivityTimeRange) {
  const projects = getActivityProjects()
  const [start, end] = getFullySyncedActivityRange(timeRange)
  // We subtract 1 day from the start to get data for change calculation
  const adjustedRange: [UnixTime, UnixTime] = [start.add(-1, 'days'), end]
  const records = await db.activityView.getDailyCountsForProjectsAndTimeRange(
    [ProjectId.ETHEREUM, ...projects.map((p) => p.id)],
    adjustedRange,
  )
  const maxCounts = await db.activityView.getMaxCountForProjects()

  const grouped = groupBy(records, (r) => r.projectId)

  const data = Object.fromEntries(
    Object.entries(grouped).map(([projectId, records]) => {
      const toCompareForChange = records.at(0)
      const actualRecords = timeRange === 'max' ? records : records.slice(1)
      const lastRecord = records.at(-1)

      if (!lastRecord || !toCompareForChange) {
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
          change:
            (lastRecord.count - toCompareForChange.count) /
            toCompareForChange.count,
          pastDayTps: countToTps(lastRecord.count),
          maxTps: {
            value: countToTps(maxCount.count),
            timestamp: maxCount.timestamp.toNumber(),
          },
          summedCount: sumCounts(actualRecords),
          syncStatus: getSyncStatus(lastRecord.timestamp),
        },
      ]
    }),
  )

  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== null),
  )
}

function countToTps(count: number) {
  return count / UnixTime.DAY
}

function sumCounts(records: DailyTransactionCountRecord[]) {
  return records.reduce((acc, r) => acc + r.count, 0)
}

function getSyncStatus(syncedUntil: UnixTime) {
  const isSynced = UnixTime.now().add(-2, 'days').lte(syncedUntil)
  return { isSynced, syncedUntil: syncedUntil.toNumber() }
}
