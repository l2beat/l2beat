import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getTrackedTxsProject } from '../../utils/get-tracked-txs-projects'
import type { CostsTimeRange } from './utils/range'
import { getFullySyncedCostsRange } from './utils/range'
import { sumCostValues } from './utils/sum-cost-values'

export async function getCostsForProject(
  projectId: string,
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const range = getFullySyncedCostsRange(timeRange)

  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['trackedTxsConfig'],
  })
  if (!project)
    return {
      ...sumCostValues([]),
      syncedUntil: UnixTime.now(),
    }
  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )

  const trackedTxsProject = getTrackedTxsProject(
    project,
    configurations,
    'l2costs',
  )
  if (!trackedTxsProject)
    return {
      ...sumCostValues([]),
      syncedUntil: UnixTime.now(),
    }

  const records = await db.aggregatedL2Cost.getByProjectAndTimeRange(
    trackedTxsProject.id,
    range,
  )

  return {
    ...sumCostValues(records),
    syncedUntil: trackedTxsProject.syncedUntil,
  }
}
