import { DailyDiscovery as DailyDiscoveryRow } from '../../kysely/generated/types'

export const selectDailyDiscovery = [
  'blockNumber',
  'chainId',
  'configHash',
  'discoveryJsonBlob',
  'projectName',
  'unixTimestamp',
  'version',
] as const satisfies (keyof DailyDiscoveryRow)[]
