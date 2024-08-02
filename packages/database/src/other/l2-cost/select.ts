import { L2Cost } from '../../kysely/generated/types'

export const selectL2Cost = [
  'blob_gas_price',
  'blob_gas_used',
  'calldata_gas_used',
  'calldata_length',
  'gas_price',
  'gas_used',
  'timestamp',
  'configuration_id',
  'tx_hash',
] as const satisfies (keyof L2Cost)[]
