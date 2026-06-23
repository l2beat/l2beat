import { projectIdToChain } from '@l2beat/config/build/global/chainMap'
import type { Database } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getComparisonWindow } from './getComparisonWindow'
import { getLargestTvsIncrease } from './highlightsCalculations'

export async function getTvsIncreaseByChain(
  db: Database,
  latestTimestamp: UnixTime,
  projectIds: readonly string[],
) {
  const tvsTimestamp =
    await db.tvsTokenValue.getMaxTimestampAtOrBeforeForProjects(
      latestTimestamp,
      projectIds,
    )

  if (!tvsTimestamp) return null

  const tvsPreviousTimestamp =
    await db.tvsTokenValue.getMaxTimestampAtOrBeforeForProjects(
      tvsTimestamp - UnixTime.DAY,
      projectIds,
    )

  if (!tvsPreviousTimestamp) return null

  const tvsOlderTimestamp =
    await db.tvsTokenValue.getMaxTimestampAtOrBeforeForProjects(
      tvsPreviousTimestamp - UnixTime.DAY,
      projectIds,
    )

  if (!tvsOlderTimestamp) return null

  const [currentTvsRecords, previousTvsRecords, olderTvsRecords] =
    await Promise.all([
      db.tvsTokenValue.getByTimestamp(tvsTimestamp),
      db.tvsTokenValue.getByTimestamp(tvsPreviousTimestamp),
      db.tvsTokenValue.getByTimestamp(tvsOlderTimestamp),
    ])

  const tvsWindow = getComparisonWindow(tvsTimestamp, tvsPreviousTimestamp)

  const tvsIncrease = getLargestTvsIncrease(
    currentTvsRecords,
    previousTvsRecords,
    olderTvsRecords,
    tvsTimestamp,
    projectIds,
  )

  if (!tvsIncrease) return null

  return {
    ...tvsWindow,
    chain: projectIdToChain(ProjectId(tvsIncrease.projectId)),
    currentVolumeUsd: tvsIncrease.currentTvsUsd,
    previousVolumeUsd: tvsIncrease.previousTvsUsd,
    increaseUsd: tvsIncrease.increaseUsd,
  }
}
