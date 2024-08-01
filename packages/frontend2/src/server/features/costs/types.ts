import { type ProjectId, type UnixTime } from '@l2beat/shared-pure'

// COSTS CHART

export interface CostsChartResponse {
  types: [
    'timestamp',
    'overheadGas',
    'overheadEth',
    'overheadUsd',
    'calldataGas',
    'calldataEth',
    'calldataUsd',
    'computeGas',
    'computeEth',
    'computeUsd',
    'blobsGas',
    'blobsEth',
    'blobsUsd',
  ]
  data: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number | undefined,
    number | undefined,
    number | undefined,
  ][]
}

// LATEST COSTS
export type LatestCostsResponse = Record<ProjectId, LatestCostsProjectResponse>

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
