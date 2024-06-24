import { UpdateNotifier as UpdateNotifierRow } from '../kysely/generated/types'

export const selectUpdateNotifier = [
  'id',
  'created_at',
  'updated_at',
  'project_name',
  'block_number',
  'diff_json_blob',
  'chain_id',
] as const satisfies (keyof UpdateNotifierRow)[]
