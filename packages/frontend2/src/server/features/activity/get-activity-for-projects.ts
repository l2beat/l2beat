import { type Layer2, type Layer3 } from '@l2beat/config'
import { db } from '~/server/database'
import { type TimeRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'
import { getActivityRange } from './utils/get-activity-range'

export async function getActivityForProjects(
  projects: (Layer2 | Layer3)[],
  timeRange: TimeRange,
) {
  const range = getActivityRange(timeRange)
  const summedCounts =
    await db.activityView.getSummedCountForProjectsAndTimeRange(
      projects.map((p) => p.id),
      range,
    )

  return Object.fromEntries(
    summedCounts.map((record) => [record.projectId, record.count]),
  )
}

export function rangeToResolution(value: TimeRange) {
  const days = rangeToDays(value)
  if (days < 30) {
    return 'hourly'
  }

  return 'daily'
}
