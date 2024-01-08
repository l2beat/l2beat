import { UnixTime } from '@l2beat/shared-pure'

import { DailyTransactionCountProjectsMap } from './types'

// the activity data is delayed by max 2 days
// we cannot summarize the day until the day finishes
// so we're left with yesterday until after midnight
// when we have 1 hour of clock delay window
// we add 1 hour more to be safe
const ACTIVITY_ACCEPTABLE_DELAY = UnixTime.DAY * 2 + 2 * UnixTime.HOUR

export function filterOutDelayedProjects(
  projectsMap: DailyTransactionCountProjectsMap,
): DailyTransactionCountProjectsMap {
  const delayedProjectsMap: DailyTransactionCountProjectsMap = new Map(
    projectsMap,
  )
  delayedProjectsMap.forEach((data, projectId) => {
    // if project is delayed src/api/controllers/activity/postprocessCounts.ts adds records with activity 0 after last records, so we filter them out
    const recordsWithActivity = data.filter((record) => record.count > 0)
    const lastTimestamp = recordsWithActivity.at(-1)?.timestamp
    if (!lastTimestamp) return
    const delay = UnixTime.now().toNumber() - lastTimestamp.toNumber()
    if (delay > ACTIVITY_ACCEPTABLE_DELAY) {
      delayedProjectsMap.delete(projectId)
    }
  })
  return delayedProjectsMap
}
