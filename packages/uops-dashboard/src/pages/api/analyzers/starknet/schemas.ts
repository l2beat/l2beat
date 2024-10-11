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

const StarknetTransaction = z.object({
  type: z.string(),
  calldata: z.array(z.string()).optional(),
  transaction_hash: z.string(),
})

export type StarknetTransaction = z.infer<typeof StarknetTransaction>

const StarknetBlock = z.object({
  block_hash: z.string(),
  block_number: z.number().int(),
  status: z.string(),
  timestamp: z.number().int(),
  transactions: z.array(StarknetTransaction),
})

export type StarknetBlock = z.infer<typeof StarknetBlock>

export const StarknetGetBlockWithTxsResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: StarknetBlock,
})

export type StarknetGetBlockWithTxsResponseBodySchema = z.infer<
  typeof StarknetGetBlockResponseBodySchema
>
