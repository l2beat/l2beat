import { AssetRisksUser } from '../../kysely/generated/types'

export const selectAssetRisksUser = [
  'id',
  'address',
  'balancesRefreshedAt',
  'tokensRefreshedAt',
  'updatedAt',
  'createdAt',
] as const satisfies (keyof AssetRisksUser)[]
