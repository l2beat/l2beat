import type { UpdateNotifier } from '../../kysely/generated/types'

export const selectUpdateNotifier = [
  'id',
  'createdAt',
  'updatedAt',
  'projectId',
  'blockNumber',
  'diffJsonBlob',
  'chainId',
] as const satisfies (keyof UpdateNotifier)[]
