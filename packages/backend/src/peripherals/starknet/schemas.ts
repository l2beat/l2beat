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

export type StarknetTransaction = z.infer<typeof StarknetTransaction>
const StarknetTransaction = z.object({
  type: z.string(),
  calldata: z.array(z.string()).optional(),
  transaction_hash: z.string(),
  sender_address: z.string().optional(),
})

export type StarknetGetBlockWithTxsResponseBodySchema = z.infer<
  typeof StarknetGetBlockWithTxsResponseBodySchema
>
export const StarknetGetBlockWithTxsResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: z.object({
    block_number: z.number().int(),
    timestamp: z.number().int(),
    block_hash: z.string(),
    transactions: z.array(StarknetTransaction),
  }),
})
