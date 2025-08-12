import { v } from '@l2beat/validate'

const GetBlobSuccessSchema = v.object({
  result: v.object({
    namespace: v.string(),
    data: v.string(),
    share_version: v.number(),
    commitment: v.string(),
    index: v.number(),
  }),
})

const GetBlobErrorSchema = v.object({
  error: v.object({
    code: v.number(),
    message: v.string(),
  }),
})

// partial - no jsonrpc preamble
export const GetBlobResponseSchema = v.union([
  GetBlobSuccessSchema,
  GetBlobErrorSchema,
])

export type GetBlobResponse = v.infer<typeof GetBlobResponseSchema>

export const CelestiaEventSchema = v.object({
  type: v.string(),
  attributes: v.array(
    v.object({
      key: v.string(),
      value: v.string(),
      index: v.boolean(),
    }),
  ),
})
export type CelestiaEvent = v.infer<typeof CelestiaEventSchema>

// partial - no data and code
export const CelestiaTransactionResultSchema = v.object({
  log: v.string(),
  events: v.array(CelestiaEventSchema),
})

export type CelestiaTransactionResult = v.infer<
  typeof CelestiaTransactionResultSchema
>

// partial - no jsonrpc preamble
export const GetBlockResultsResponseSchema = v.object({
  result: v.object({
    txs_results: v.array(CelestiaTransactionResultSchema),
  }),
})

export type GetBlockResultsResponse = v.infer<
  typeof GetBlockResultsResponseSchema
>
