import { AssetRisksUser } from '../../kysely/generated/types'

export const selectAssetRisksUser = [
  'id',
  'address',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof AssetRisksUser)[]
