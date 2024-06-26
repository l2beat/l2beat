import { AggregatedL2Cost as AggregatedL2CostRow } from '../kysely/generated/types'

export const selectAggregatedL2Costs = [
  'timestamp',
  'project_id',
  'total_gas',
  'total_gas_eth',
  'total_gas_usd',
  'blobs_gas',
  'blobs_gas_eth',
  'blobs_gas_usd',
  'calldata_gas',
  'calldata_gas_eth',
  'calldata_gas_usd',
  'compute_gas',
  'compute_gas_eth',
  'compute_gas_usd',
  'overhead_gas',
  'overhead_gas_eth',
  'overhead_gas_usd',
] as const satisfies (keyof AggregatedL2CostRow)[]
