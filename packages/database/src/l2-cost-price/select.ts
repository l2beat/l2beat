import { L2CostPrice as L2CostPriceRow } from '../kysely/generated/types'

export const selectL2CostPrice = [
  'price_usd',
  'timestamp',
] as const satisfies (keyof L2CostPriceRow)[]
