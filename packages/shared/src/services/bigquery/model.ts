import { z } from 'zod'

export type LivenessQuery = z.infer<typeof LivenessQuery>
export const LivenessQuery = z
  .object({
    block_number: z.number(),
    block_timestamp: z.string(),
    transaction_hash: z.string(),
  })
  .array()
