import { z } from 'zod'

export type BigQueryMethodsResult = z.infer<typeof BigQueryMethodsResult>
export const BigQueryMethodsResult = z
  .object({
    block_number: z.number(),
    input: z.string(),
    to_address: z.string(),
    block_timestamp: z.string(),
    transaction_hash: z.string(),
  })
  .array()

export type BigQueryTransfersResult = z.infer<typeof BigQueryTransfersResult>
export const BigQueryTransfersResult = z
  .object({
    block_number: z.number(),
    from_address: z.string(),
    to_address: z.string(),
    block_timestamp: z.string(),
    transaction_hash: z.string(),
  })
  .array()
