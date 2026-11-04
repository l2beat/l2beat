import { ProjectId, type UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getDb } from '~/server/database'
import type { ChartRange } from '~/utils/range/range'
import type { LatestCostsProjectResponse } from './types'
import { sumCostValues } from './utils/sumCostValues'

export async function getCostsForProject(
  projectId: string,
  range: ChartRange,
): Promise<LatestCostsProjectResponse | undefined> {
  if (env.MOCK) {
    return getMockedCostsForProject()
  }

  const records = await getDb().aggregatedL2Cost.getByProjectAndTimeRange(
    ProjectId(projectId),
    range,
  )
  if (records.length === 0) return undefined

  const timestamps = records.map((r) => r.timestamp)
  const dataRange: [UnixTime, UnixTime] = [
    Math.min(...timestamps),
    Math.max(...timestamps),
  ]

  return {
    ...sumCostValues(records),
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
    range: [Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY],
  }
}
