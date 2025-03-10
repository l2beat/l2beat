import type { Project } from '@l2beat/config'
import { groupBy } from 'lodash'
import { getDb } from '~/server/database'
import { getTrackedTxsProjects } from '../../utils/get-tracked-txs-projects'
import type { LatestCostsResponse } from './types'
import type { CostsTimeRange } from './utils/range'
import { getFullySyncedCostsRange } from './utils/range'
import { sumCostValues } from './utils/sum-cost-values'

export async function getCostsForProjects(
  projects: Project<'trackedTxsConfig'>[],
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const response: LatestCostsResponse = {}
  const range = getFullySyncedCostsRange(timeRange)

  const configurations = await db.indexerConfiguration.getByIndexerId(
    'tracked_txs_indexer',
  )

  const trackedTxsProjects = getTrackedTxsProjects(
    projects,
    configurations,
    'l2costs',
  )

  const records = await db.aggregatedL2Cost.getByProjectsAndTimeRange(
    trackedTxsProjects.map((p) => p.id),
    range,
  )

  const groupedRecords = groupBy(records, 'projectId')

  for (const project of trackedTxsProjects) {
    const records = groupedRecords[project.id]
    if (records === undefined) continue
    response[project.id] = {
      ...sumCostValues(records),
      syncedUntil: project.syncedUntil,
    }
  }
  return response
}
