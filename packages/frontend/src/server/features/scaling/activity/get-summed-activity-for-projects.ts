import { ProjectId } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'

import { UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import type { TimeRange } from '~/utils/range/range'
import type { ActivityRecord } from '@l2beat/database'
import { groupBy } from 'lodash'

export function getSummedActivityForProjects(
  projectIds: string[],
  timeRange: TimeRange,
  rangeByProject: Record<string, [UnixTime, UnixTime]>,
) {
  if (env.MOCK) {
    return Object.fromEntries(projectIds.map((projectId) => [projectId, 10000]))
  }

  return getCachedSummedActivityForProjects(
    projectIds,
    timeRange,
    rangeByProject,
  )
}

const getCachedSummedActivityForProjects = cache(
  async (
    projectIds: string[],
    timeRange: TimeRange,
    rangeByProject: Record<string, [UnixTime, UnixTime]>,
  ) => {
    const db = getDb()
    const range = getFullySyncedActivityRange(timeRange)
    const records = await db.activity.getByProjectsAndTimeRange(
      projectIds.map(ProjectId),
      range,
    )

    return sumByProject(records, rangeByProject)
  },
  ['summed-activity-for-projects'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function sumByProject(
  records: ActivityRecord[],
  rangeByProject: Record<string, [UnixTime, UnixTime]>,
) {
  const groupedByProject = groupBy(records, 'projectId')
  return Object.fromEntries(
    Object.entries(groupedByProject).map(([projectId, records]) => {
      const range = rangeByProject[projectId]
      if (!range) return [projectId, 0]
      const filteredRecords = records.filter(
        (r) => r.timestamp >= range[0] && r.timestamp <= range[1],
      )
      return [
        projectId,
        filteredRecords.reduce(
          (acc, record) => acc + (record.uopsCount ?? record.count),
          0,
        ),
      ]
    }),
  )
}
