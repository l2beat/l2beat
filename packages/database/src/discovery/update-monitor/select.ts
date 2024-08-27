import { UpdateMonitor } from '../../kysely/generated/types'

export const selectUpdateMonitor = [
  'projectName',
  'chainId',
  'blockNumber',
  'unixTimestamp',
  'discoveryJsonBlob',
  'configHash',
  'version',
] as const satisfies (keyof UpdateMonitor)[]
