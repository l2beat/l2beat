import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getDb } from '~/server/database'
import type { TimeRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export async function getSummedActivityForProjects(
  projectIds: string[],
  timeRange: TimeRange,
  rangeByProject: Record<string, [UnixTime, UnixTime]>,
) {
  const db = getDb()
  const range = getFullySyncedActivityRange({ type: timeRange })
  const records = await db.activity.getByProjectsAndTimeRange(
    projectIds.map(ProjectId),
    range,
  )

  return sumByProject(records, rangeByProject)
}

function sumByProject(
  records: ActivityRecord[],
  rangeByProject: Record<string, [UnixTime, UnixTime]>,
) {
  const groupedByProject = groupBy(records, 'projectId')
  return Object.fromEntries(
    Object.entries(groupedByProject).map(([projectId, records]) => {
      const range = rangeByProject[projectId]
      if (!range) return [projectId, 0]
      const adjustedRange = [
        UnixTime.toStartOf(range[0], 'day'),
        UnixTime.toStartOf(range[1], 'day'),
      ] as const
      const filteredRecords = records.filter(
        (r) =>
          r.timestamp >= adjustedRange[0] && r.timestamp <= adjustedRange[1],
      )

      const summed = filteredRecords.reduce(
        (acc, record) => acc + (record.uopsCount ?? record.count),
        0,
      )

      return [projectId, summed]
    }),
  )
}
