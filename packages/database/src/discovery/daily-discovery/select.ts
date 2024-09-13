import { DailyDiscovery as DailyDiscoveryRow } from '../../kysely/generated/types'

export const selectDailyDiscovery = [
  'blockNumber',
  'chainId',
  'configHash',
  'discoveryJsonBlob',
  'projectName',
  'timestamp',
  'version',
] as const satisfies (keyof DailyDiscoveryRow)[]
