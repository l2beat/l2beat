import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { projectIdToChain } from '../../../../../../config/chainMap'
import { getActivityComparisonWindow } from './getComparisonWindow'
import { getLargestUopsCountIncrease } from './highlightsCalculations'

export async function getUopsIncreaseByChain(
  db: Database,
  latestTimestamp: UnixTime,
  projectIds: string[],
) {
  let activityTimestamp =
    await db.activity.getMaxTimestampAtOrBeforeForProjects(
      latestTimestamp,
      projectIds,
    )

  if (activityTimestamp === undefined) return null

  if (activityTimestamp === UnixTime.toStartOf(UnixTime.now(), 'day')) {
    // Activity is aggregated per day but last day is not full until midnight.
    activityTimestamp = activityTimestamp - UnixTime.DAY
  }

  const activityPreviousTimestamp = activityTimestamp - UnixTime.DAY
  const activityOlderTimestamp = activityTimestamp - 2 * UnixTime.DAY

  const [
    currentActivityRecords,
    previousActivityRecords,
    olderActivityRecords,
  ] = await Promise.all([
    db.activity.getByTimestamp(activityTimestamp),
    db.activity.getByTimestamp(activityPreviousTimestamp),
    db.activity.getByTimestamp(activityOlderTimestamp),
  ])

  const activityWindow = getActivityComparisonWindow(activityTimestamp)

  const uopsIncrease = getLargestUopsCountIncrease(
    currentActivityRecords,
    previousActivityRecords,
    olderActivityRecords,
    activityTimestamp,
    projectIds,
  )

  if (!uopsIncrease) return null

  return {
    ...activityWindow,
    chain: projectIdToChain(uopsIncrease.projectId),
    currentCount: uopsIncrease.currentUopsCount,
    previousCount: uopsIncrease.previousUopsCount,
    increase: uopsIncrease.increase,
    increasePercent: uopsIncrease.increasePercent,
  }
}
