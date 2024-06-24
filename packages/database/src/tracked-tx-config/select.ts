import { TrackedTxsConfig as TrackedTxsConfigRow } from '../kysely/generated/types'

export const selectTrackedTxConfig = [
  'id',
  'debug_info',
  'last_synced_timestamp',
  'project_id',
  'since_timestamp_inclusive',
  'subtype',
  'type',
  'until_timestamp_exclusive',
] as const satisfies (keyof TrackedTxsConfigRow)[]
