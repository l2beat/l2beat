import { type Layer2, type Layer3 } from '@l2beat/config'
import { db } from '~/server/database'
import { type TimeRange, getRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

export async function getActivityForProjects(
  projects: (Layer2 | Layer3)[],
  timeRange: TimeRange,
) {
  const resolution = rangeToResolution(timeRange)
  const range = getRange(timeRange, resolution)

  const summedCounts =
    await db.activityView.getSummedCountForProjectsAndTimeRange(
      projects.map((p) => p.id),
      range,
    )

  return Object.fromEntries(
    Object.entries(summedCounts).map(([projectId, record]) => [
      projectId,
      record.count,
    ]),
  )
}

export function rangeToResolution(value: TimeRange) {
  const days = rangeToDays(value)
  if (days < 30) {
    return 'hourly'
  }

  return 'daily'
}
