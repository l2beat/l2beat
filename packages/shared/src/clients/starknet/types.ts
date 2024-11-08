import { z } from 'zod'

export type StarknetGetBlockResponse = z.infer<typeof StarknetGetBlockResponse>
export const StarknetGetBlockResponse = z.object({
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

export type StarknetGetBlockWithTxsResponse = z.infer<
  typeof StarknetGetBlockWithTxsResponse
>
export const StarknetGetBlockWithTxsResponse = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: z.object({
    block_number: z.number().int(),
    timestamp: z.number().int(),
    block_hash: z.string(),
    transactions: z.array(StarknetTransaction),
  }),
})

export type StarknetErrorResponse = z.infer<typeof StarknetErrorResponse>
export const StarknetErrorResponse = z.object({
  jsonrpc: z.literal('2.0'),
  error: z.object({
    code: z.number().int(),
    message: z.string(),
  }),
})
