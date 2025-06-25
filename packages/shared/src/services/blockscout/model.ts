import { UnixTime } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type BlockscoutSuccessResponse = v.infer<
  typeof BlockscoutSuccessResponse
>
const BlockscoutSuccessResponse = v.object({
  message: v.literal('OK'),
  result: v.unknown(),
})

export type BlockscoutErrorResponse = v.infer<typeof BlockscoutErrorResponse>
const BlockscoutErrorResponse = v.object({
  message: v.literal('NOTOK'),
  result: v.string(),
})

export type BlockscoutResponse = v.infer<typeof BlockscoutResponse>
const BlockscoutResponse = v.union([
  BlockscoutSuccessResponse,
  BlockscoutErrorResponse,
])

export function parseBlockscoutResponse(value: string): BlockscoutResponse {
  try {
    const json: unknown = JSON.parse(value)
    return BlockscoutResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Blockscout response')
  }
}

export type BlockscoutNextPageParams = v.infer<typeof BlockscoutNextPageParams>

export const BlockscoutNextPageParams = v.object({
  block_number: v.number(),
  index: v.number(),
  items_count: v.number(),
  transaction_index: v.number(),
})

export type BlockscoutAddressParam = v.infer<typeof BlockscoutAddressParam>

export const BlockscoutAddressParam = v.object({
  ens_domain_name: v.union([v.string(), v.null()]),
  hash: v.string(),
  implementation_name: v.union([v.string(), v.null(), v.undefined()]),
  is_contract: v.boolean(),
  is_verified: v.boolean(),
  metadata: v.union([v.string(), v.null()]),
  name: v.union([v.string(), v.null()]),
  private_tags: v.array(v.unknown()),
  public_tags: v.array(v.unknown()),
  watchlist_names: v.array(v.unknown()),
})

export type BlockscoutInternalTransaction = v.infer<
  typeof BlockscoutInternalTransaction
>

export const BlockscoutInternalTransaction = v.object({
  block_index: v.number(),
  block_number: v.number(),
  created_contract: v.unknown(),
  error: v.unknown(),
  from: BlockscoutAddressParam,
  gas_limit: v.string(),
  index: v.number(),
  success: v.boolean(),
  timestamp: v.string().transform((s) => UnixTime.fromDate(new Date(s))),
  to: v.union([BlockscoutAddressParam, v.null()]),
  transaction_hash: v.string(),
  type: v.string(),
  value: v.string(),
})

export type BlockscoutGetInternalTransactionsResponse = v.infer<
  typeof BlockscoutGetInternalTransactionsResponse
>

export const BlockscoutGetInternalTransactionsResponse = v.object({
  items: v.array(BlockscoutInternalTransaction),
  next_page_params: v.union([BlockscoutNextPageParams, v.null()]),
})
