import { z } from 'zod'

export interface SvmBlock {
  number: number
  hash: string
  timestamp: number
  transactionsCount: number
}

export type SolanaGetBlockTimeResponse = z.infer<
  typeof SolanaGetBlockTimeResponse
>
export const SolanaGetBlockTimeResponse = z.object({
  result: z.number().nullable(),
})

export type SolanaGetLatestBlockhashResponse = z.infer<
  typeof SolanaGetLatestBlockhashResponse
>
export const SolanaGetLatestBlockhashResponse = z.object({
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

export type SolanaGetBlockResponse = z.infer<typeof SolanaGetBlockResponse>
export const SolanaGetBlockResponse = z.object({
  result: z.object({
    blockHeight: z.number(),
    blockTime: z.number(),
    blockhash: z.string(),
    parentSlot: z.number(),
    previousBlockhash: z.string(),
    transactions: z.array(z.any()), // TODO: Define the structure of transactions
  }),
})

export type SolanaApiErrorResponse = z.infer<typeof SolanaApiErrorResponse>
export const SolanaApiErrorResponse = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
})
