import type { UpdateNotifier } from '../../kysely/generated/types'

export const selectUpdateNotifier = [
  'id',
  'createdAt',
  'updatedAt',
  'projectName',
  'blockNumber',
  'diffJsonBlob',
  'chainId',
] as const satisfies (keyof UpdateNotifier)[]
