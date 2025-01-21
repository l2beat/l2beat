import type { L2CostPrice } from '../../kysely/generated/types'

export const selectL2CostPrice = [
  'priceUsd',
  'timestamp',
] as const satisfies (keyof L2CostPrice)[]
