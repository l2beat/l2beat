import type { UnixTime } from '@l2beat/shared-pure'
import type { ChartUnit } from '~/components/chart/types'

export type CostsUnit = ChartUnit | 'gas'

// LATEST COSTS
export type LatestCostsResponse = Record<string, LatestCostsProjectResponse>

export interface LatestCostsProjectResponse {
  gas: LatestCostsValues
  eth: LatestCostsValues
  usd: LatestCostsValues
  syncedUntil: UnixTime
}

interface LatestCostsValues {
  overhead: number
  calldata: number
  compute: number
  blobs: number | undefined
}
