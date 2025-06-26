import { Quantity } from '@l2beat/shared'
import { v } from '@l2beat/validate'

export type EventType = 'newHeads' | 'logs' | 'pendingTransactions'

export type NewHeadsEvent = v.infer<typeof NewHeadsEvent>
export const NewHeadsEvent = v.object({
  params: v.object({
    subscription: v.string(),
    result: v.object({
      number: Quantity.decode.transform((n) => Number(n)),
      timestamp: Quantity.decode.transform((n) => Number(n)),
    }),
  }),
})
