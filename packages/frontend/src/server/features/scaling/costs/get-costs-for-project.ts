import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { unstable_cache as cache } from 'next/cache'
import { env } from '~/env'
import { getDb } from '~/server/database'
import { ps } from '~/server/projects'
import { getTrackedTxsProject } from '../../utils/get-tracked-txs-projects'
import type { LatestCostsValues } from './types'
import type { CostsTimeRange } from './utils/range'
import { getFullySyncedCostsRange } from './utils/range'
import { sumCostValues } from './utils/sum-cost-values'

interface CostsForProject {
  syncedUntil: number
  range: [UnixTime, UnixTime]
  gas: LatestCostsValues
  eth: LatestCostsValues
  usd: LatestCostsValues
}

export function getCostsForProject(
  projectId: string,
  timeRange: CostsTimeRange,
) {
  if (env.MOCK) {
    return getMockedCostsForProject()
  }

  return getCachedCostsForProject(projectId, timeRange)
}

const getCachedCostsForProject = cache(
  async (
    projectId: string,
    timeRange: CostsTimeRange,
  ): Promise<CostsForProject> => {
    const db = getDb()
    const fullySyncedRange = getFullySyncedCostsRange(timeRange)

    const project = await ps.getProject({
      id: ProjectId(projectId),
      select: ['trackedTxsConfig'],
    })
    if (!project)
      return {
        ...sumCostValues([]),
        syncedUntil: UnixTime.now(),
        range: fullySyncedRange,
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
        range: fullySyncedRange,
      }

    const records = await db.aggregatedL2Cost.getByProjectAndTimeRange(
      trackedTxsProject.id,
      fullySyncedRange,
    )
    const timestamps = records.map((r) => r.timestamp)
    const range: [UnixTime, UnixTime] = [
      Math.min(...timestamps),
      Math.max(...timestamps),
    ]

    return {
      ...sumCostValues(records),
      syncedUntil: trackedTxsProject.syncedUntil,
      range,
    }
  },
  ['costs-for-project'],
  { tags: ['hourly-data'], revalidate: UnixTime.HOUR },
)

function getMockedCostsForProject(): CostsForProject {
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
    range: [-Infinity, Infinity],
  }
}
