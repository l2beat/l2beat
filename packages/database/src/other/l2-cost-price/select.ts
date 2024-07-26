import { L2CostPrice } from '../../kysely/generated/types'

export const selectL2CostPrice = [
  'price_usd',
  'timestamp',
] as const satisfies (keyof L2CostPrice)[]
