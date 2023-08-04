import { z } from 'zod'

export type StarknetGetBlockResponseBodySchema = z.infer<
  typeof StarknetGetBlockResponseBodySchema
>
export const StarknetGetBlockResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: z.object({
    block_number: z.number().int(),
    timestamp: z.number().int(),
    transactions: z.array(z.string()),
  }),
})
