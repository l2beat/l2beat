import { v as z } from '@l2beat/validate'

export interface SvmBlock {
  number: number
  hash: string
  timestamp: number
  transactionsCount: number
}

export type SvmRpcGetBlockTimeResponse = z.infer<
  typeof SvmRpcGetBlockTimeResponse
>
export const SvmRpcGetBlockTimeResponse = z.object({
  result: z.union([z.number(), z.null()]),
})

export type SvmRpcGetLatestBlockhashResponse = z.infer<
  typeof SvmRpcGetLatestBlockhashResponse
>
export const SvmRpcGetLatestBlockhashResponse = z.object({
  result: z.object({
    context: z.object({
      apiVersion: z.string(),
      slot: z.number(),
    }),
    value: z.object({
      blockhash: z.string(),
      lastValidBlockHeight: z.number(),
    }),
  }),
})

export type SvmRpcGetBlockResponse = z.infer<typeof SvmRpcGetBlockResponse>
export const SvmRpcGetBlockResponse = z.object({
  result: z.object({
    blockHeight: z.number(),
    blockTime: z.number(),
    blockhash: z.string(),
    parentSlot: z.number(),
    previousBlockhash: z.string(),
    transactions: z.array(z.unknown()),
  }),
})

export type SvmRpcApiErrorResponse = z.infer<typeof SvmRpcApiErrorResponse>
export const SvmRpcApiErrorResponse = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
})
