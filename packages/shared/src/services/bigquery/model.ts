import { z } from 'zod'

export type QueryRows = z.infer<typeof QueryRows>
export const QueryRows = z
  .object({
    block_number: z.number(),
    block_timestamp: z.string(),
    transaction_hash: z.string(),
  })
  .array()
