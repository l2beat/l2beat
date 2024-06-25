import { UpdateMonitor as UpdateMonitorRow } from '../kysely/generated/types'

export const selectUpdateMonitor = [
  'project_name',
  'chain_id',
  'block_number',
  'unix_timestamp',
  'discovery_json_blob',
  'config_hash',
  'version',
] as const satisfies (keyof UpdateMonitorRow)[]
