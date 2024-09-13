import { UpdateMonitor } from '../../kysely/generated/types'

export const selectUpdateMonitor = [
  'projectName',
  'chainId',
  'blockNumber',
  'timestamp',
  'discoveryJsonBlob',
  'configHash',
  'version',
] as const satisfies (keyof UpdateMonitor)[]
