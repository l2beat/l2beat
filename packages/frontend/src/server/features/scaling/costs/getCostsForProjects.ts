import type { Project } from '@l2beat/config'
import groupBy from 'lodash/groupBy'
import { getDb } from '~/server/database'
import { getTrackedTxsProjects } from '../../utils/getTrackedTxsProjects'
import type { LatestCostsResponse } from './types'
import type { CostsTimeRange } from './utils/range'
import { getCostsRange } from './utils/range'
import { sumCostValues } from './utils/sumCostValues'

export async function getCostsForProjects(
  projects: Project<'trackedTxsConfig'>[],
  timeRange: CostsTimeRange,
) {
  const db = getDb()
  const response: LatestCostsResponse = {}
  const range = getCostsRange({ type: timeRange })

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
    const timestamps = records.map((r) => r.timestamp)
    const from = Math.min(...timestamps)
    const to = Math.max(...timestamps)
    response[project.id] = {
      ...sumCostValues(records),
      range: [from, to],
      syncedUntil: project.syncedUntil,
    }
  }
  return response
}
