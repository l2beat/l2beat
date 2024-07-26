import { Liveness } from '../../kysely/generated/types'

export const selectLiveness = [
  'configuration_id',
  'tx_hash',
  'block_number',
  'timestamp',
] as const satisfies (keyof Liveness)[]
