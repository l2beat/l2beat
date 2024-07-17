import { Starkex } from '../kysely/generated/types'

export const selectStarkExTransactionCount = [
  'unix_timestamp',
  'project_id',
  'count',
] as const satisfies (keyof Starkex)[]
