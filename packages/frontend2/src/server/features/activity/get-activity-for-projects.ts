import { type Layer2, type Layer3 } from '@l2beat/config'
import { groupBy } from 'lodash'
import { db } from '~/server/database'
import { TimeRange, getRange } from '~/utils/range/range'
import { rangeToDays } from '~/utils/range/range-to-days'

export async function getActivityForProjects(
  projects: (Layer2 | Layer3)[],
  timeRange: TimeRange,
) {
  const result: Record<string, number | undefined> = {}
  const resolution = rangeToResolution(timeRange)
  const range = getRange(timeRange, resolution)

  const dailyCount =
    await db.activityView.getDailyCountsForProjectsAndTimeRange(
      projects.map((p) => p.id),
      range,
    )

  const groupedByProjectId = groupBy(dailyCount, 'projectId')

  for (const [projectId, records] of Object.entries(groupedByProjectId)) {
    result[projectId] = records.reduce((acc, r) => acc + r.count, 0)
  }

  return result
}

export function rangeToResolution(value: TimeRange) {
  const days = rangeToDays(value)
  if (days < 30) {
    return 'hourly'
  }

  return 'daily'
}
