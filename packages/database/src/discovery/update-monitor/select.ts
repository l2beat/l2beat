import type { UpdateMonitor } from '../../kysely/generated/types'

export const selectUpdateMonitor = [
  'projectId',
  'chainId',
  'blockNumber',
  'timestamp',
  'discoveryJsonBlob',
  'configHash',
] as const satisfies (keyof UpdateMonitor)[]
