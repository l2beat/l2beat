import { z } from 'zod'

const GetBlobSuccessSchema = z.object({
  result: z.object({
    namespace: z.string(),
    data: z.string(),
    share_version: z.number(),
    commitment: z.string(),
    index: z.number(),
  }),
})

const GetBlobErrorSchema = z.object({
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
})

// partial - no jsonrpc preamble
export const GetBlobResponseSchema = z.union([
  GetBlobSuccessSchema,
  GetBlobErrorSchema,
])

export type GetBlobResponse = z.infer<typeof GetBlobResponseSchema>

// partial - no data and code
export const CelestiaTransactionResultSchema = z.object({
  log: z.string(),
})

export type CelestiaTransactionResult = z.infer<
  typeof CelestiaTransactionResultSchema
>

// partial - no jsonrpc preamble
export const GetBlockResultsResponseSchema = z.object({
  result: z.object({
    txs_results: z.array(CelestiaTransactionResultSchema),
  }),
})

export type GetBlockResultsResponse = z.infer<
  typeof GetBlockResultsResponseSchema
>
