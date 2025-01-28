import type { CurrentPrice } from '../../kysely/generated/types'

export const selectCurrentPrice = [
  'coingeckoId',
  'priceUsd',
  'updatedAt',
] as const satisfies (keyof CurrentPrice)[]
