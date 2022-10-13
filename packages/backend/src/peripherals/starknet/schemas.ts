import { z } from 'zod'

export type StarkNetGetBlockResponseBodySchema = z.infer<
  typeof StarkNetGetBlockResponseBodySchema
>
export const StarkNetGetBlockResponseBodySchema = z.object({
  block_number: z.number().int(),
  timestamp: z.number().int(),
  transactions: z.array(z.unknown()),
})
