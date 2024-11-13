import { type Layer2, type Layer3 } from '@l2beat/config'
import { db } from '~/server/database'
import { type TimeRange } from '~/utils/range/range'
import { getFullySyncedActivityRange } from './utils/get-fully-synced-activity-range'

export async function getLatestActivityForProjects(
  projects: (Layer2 | Layer3)[],
  timeRange: TimeRange,
) {
  const range = getFullySyncedActivityRange(timeRange)
  const summedCounts = await db.activity.getSummedCountForProjectsAndTimeRange(
    projects.map((p) => p.id),
    range,
  )

  return Object.fromEntries(
    summedCounts.map((record) => [record.projectId, record.count]),
  )
}
