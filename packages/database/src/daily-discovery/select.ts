import { DailyDiscovery as DailyDiscoveryRow } from '../kysely/generated/types'

export const selectDailyDiscovery = [
  'block_number',
  'chain_id',
  'config_hash',
  'discovery_json_blob',
  'project_name',
  'unix_timestamp',
  'version',
] as const satisfies (keyof DailyDiscoveryRow)[]
