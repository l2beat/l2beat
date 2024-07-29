import { Block } from '../../kysely/generated/types'

export const selectBlockTransactionCount = [
  'unix_timestamp',
  'project_id',
  'block_number',
  'count',
] as const satisfies (keyof Block)[]
