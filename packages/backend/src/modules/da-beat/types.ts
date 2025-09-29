import { v } from '@l2beat/validate'

export const CoingeckoResponse = v.array(
  v.object({ id: v.string(), current_price: v.number() }),
)
