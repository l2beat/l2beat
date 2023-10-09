import { z } from 'zod'

export type LivenessMethodsQuery = z.infer<typeof LivenessMethodsQuery>
export const LivenessMethodsQuery = z
  .object({
    block_number: z.number(),
    input: z.string(),
    to_address: z.string(),
    block_timestamp: z.string(),
    transaction_hash: z.string(),
  })
  .array()

export type LivenessTransfersQuery = z.infer<typeof LivenessTransfersQuery>
export const LivenessTransfersQuery = z
  .object({
    block_number: z.number(),
    to_address: z.string(),
    block_timestamp: z.string(),
    transaction_hash: z.string(),
  })
  .array()
