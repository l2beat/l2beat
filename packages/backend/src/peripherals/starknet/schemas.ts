import { z } from 'zod'

export type StarknetGetBlockResponseBodySchema = z.infer<
  typeof StarknetGetBlockResponseBodySchema
>
export const StarknetGetBlockResponseBodySchema = z.object({
  block_number: z.number().int(),
  timestamp: z.number().int(),
  transactions: z.array(z.unknown()),
})
