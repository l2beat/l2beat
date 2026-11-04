import type { ProjectId } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import type { LatestCostsResponse } from './types'
import { sumCostValues } from './utils/sumCostValues'

export async function getCostsForProjects(
  projectIds: ProjectId[],
  range: ChartRange,
) {
  const db = getDb()
  const response: LatestCostsResponse = {}

  const [syncMetadata, records] = await Promise.all([
    db.syncMetadata.getByFeatureAndIds('l2costs', projectIds),
    db.aggregatedL2Cost.getByProjectsAndTimeRange(projectIds, range),
  ])

  const groupedRecords = groupBy(records, 'projectId')

  for (const { id, syncedUntil } of syncMetadata) {
    const records = groupedRecords[id]
    if (records === undefined || syncedUntil === null) continue
    const timestamps = records.map((r) => r.timestamp)
    const from = Math.min(...timestamps)
    const to = Math.max(...timestamps)
    response[id] = {
      ...sumCostValues(records),
      range: [from, to],
      syncedUntil,
    }
  }
  return response
}
