import { z } from 'zod'

const GetBlobSuccessSchema = z.object({
  id: z.number(),
  jsonrpc: z.string(),
  result: z.object({
    namespace: z.string(),
    data: z.string(),
    share_version: z.number(),
    commitment: z.string(),
    index: z.number(),
  }),
})

const GetBlobErrorSchema = z.object({
  id: z.number(),
  jsonrpc: z.string(),
  error: z.object({
    code: z.number(),
    message: z.string(),
  }),
})

export const GetBlobResponseSchema = z.union([
  GetBlobSuccessSchema,
  GetBlobErrorSchema,
])

export type GetBlobResponse = z.infer<typeof GetBlobResponseSchema>

export const CelestiaTransactionResultSchema = z.object({
  // not needed - data might be big
  // code: z.number(),
  // data: z.string().nullable(),
  log: z.string(),
})

export type CelestiaTransactionResult = z.infer<
  typeof CelestiaTransactionResultSchema
>

export const GetBlockResultsResponseSchema = z.object({
  jsonrpc: z.string(),
  id: z.number(),
  result: z.object({
    txs_results: z.array(CelestiaTransactionResultSchema),
  }),
})

export type GetBlockResultsResponse = z.infer<
  typeof GetBlockResultsResponseSchema
>
