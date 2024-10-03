import { AssetRisksBalance } from '../../kysely/generated/types'

export const selectAssetRisksBalance = [
  'id',
  'userId',
  'tokenId',
  'balance',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof AssetRisksBalance)[]
