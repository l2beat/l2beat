import { CurrentPrice } from '../kysely/generated/types'

export const selectCurrentPrice = [
  'assetId',
  'priceUsd',
  'updatedAt',
] as const satisfies (keyof CurrentPrice)[]
