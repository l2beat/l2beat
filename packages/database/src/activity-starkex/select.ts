import { Starkex as StarkexTransactionCountRow } from '../kysely/generated/types'

export const selectStarkexTransactionCount = [
  'unix_timestamp',
  'project_id',
  'count',
] as const satisfies (keyof StarkexTransactionCountRow)[]
