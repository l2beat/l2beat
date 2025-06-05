import { Quantity } from '@l2beat/shared'
import { z } from 'zod'

export type EventType = 'newHeads' | 'logs' | 'pendingTransactions'

export type NewHeadsEvent = z.infer<typeof NewHeadsEvent>
export const NewHeadsEvent = z.object({
  params: z.object({
    subscription: z.string(),
    result: z.object({
      number: Quantity.decode.transform((n) => Number(n)),
      timestamp: Quantity.decode.transform((n) => Number(n)),
    }),
  }),
})
