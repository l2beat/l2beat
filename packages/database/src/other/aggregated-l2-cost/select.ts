import type { AggregatedL2Cost } from '../../kysely/generated/types'

export const selectAggregatedL2Costs = [
  'timestamp',
  'projectId',
  'totalGas',
  'totalGasEth',
  'totalGasUsd',
  'blobsGas',
  'blobsGasEth',
  'blobsGasUsd',
  'calldataGas',
  'calldataGasEth',
  'calldataGasUsd',
  'computeGas',
  'computeGasEth',
  'computeGasUsd',
  'overheadGas',
  'overheadGasEth',
  'overheadGasUsd',
] as const satisfies (keyof AggregatedL2Cost)[]
