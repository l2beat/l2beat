import type { ActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/getFullySyncedActivityRange'

export async function getSummedActivityForProjects(
  projectIds: string[],
  range: ChartRange,
  rangeByProject: Record<string, [UnixTime, UnixTime]>,
) {
  const db = getDb()
  const fullySyncedRange = await getFullySyncedActivityRange(range)
  const records = await db.activity.getByProjectsAndTimeRange(
    projectIds.map(ProjectId),
    fullySyncedRange,
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
