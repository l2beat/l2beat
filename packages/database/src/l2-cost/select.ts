import { L2Cost as L2CostRow } from '../kysely/generated/types'

export const selectL2Cost = [
  'blob_gas_price',
  'blob_gas_used',
  'calldata_gas_used',
  'calldata_length',
  'gas_price',
  'gas_used',
  'timestamp',
  'tracked_tx_id',
  'tx_hash',
] as const satisfies (keyof L2CostRow)[]
