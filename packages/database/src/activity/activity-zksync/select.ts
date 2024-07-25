import { ZkSync } from '../../kysely/generated/types'

export const selectZksyncTransaction = [
  'unix_timestamp',
  'block_number',
  'block_index',
] as const satisfies (keyof ZkSync)[]
