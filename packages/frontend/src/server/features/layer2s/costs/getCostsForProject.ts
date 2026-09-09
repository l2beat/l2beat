import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import type { ChartRange } from '~/utils/range/range'
import { getTrackedTxsProject } from '../../utils/getTrackedTxsProjects'
import type { LatestCostsProjectResponse } from './types'
import { sumCostValues } from './utils/sumCostValues'

export async function getCostsForProject(
  projectId: string,
  range: ChartRange,
): Promise<LatestCostsProjectResponse | undefined> {
  if (env.MOCK) {
    return getMockedCostsForProject()
  }

  const db = getDb()

  const project = await ps.getProject({
    id: ProjectId(projectId),
    select: ['trackedTxsConfig'],
  })
  if (!project) return undefined
  const [configurations, records] = await Promise.all([
    db.indexerConfiguration.getByIndexerId('tracked_txs_indexer'),
    db.aggregatedL2Cost.getByProjectAndTimeRange(project.id, range),
  ])

  const trackedTxsProject = getTrackedTxsProject(
    project,
    configurations,
    'l2costs',
  )
  if (!trackedTxsProject || records.length === 0) return undefined

  const timestamps = records.map((r) => r.timestamp)
  const dataRange: [UnixTime, UnixTime] = [
    Math.min(...timestamps),
    Math.max(...timestamps),
  ]

  return {
    ...sumCostValues(records),
    syncedUntil: trackedTxsProject.syncedUntil,
    range: dataRange,
  }
}

function getMockedCostsForProject(): LatestCostsProjectResponse {
  return {
    gas: {
      overhead: 1_000_000,
      calldata: 2_000_000,
      compute: 3_000_000,
      blobs: 500_000,
    },
    eth: {
      overhead: 0.05,
      calldata: 0.1,
      compute: 0.15,
      blobs: 0.025,
    },
    usd: {
      overhead: 100,
      calldata: 200,
      compute: 300,
      blobs: 50,
    },
    syncedUntil: UnixTime.now(),
    range: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  }
}
