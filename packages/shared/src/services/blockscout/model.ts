import { UnixTime, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

export type BlockscoutSuccessResponse = z.infer<
  typeof BlockscoutSuccessResponse
>
const BlockscoutSuccessResponse = z.object({
  message: z.literal('OK'),
  result: z.unknown(),
})

export type BlockscoutErrorResponse = z.infer<typeof BlockscoutErrorResponse>
const BlockscoutErrorResponse = z.object({
  message: z.literal('NOTOK'),
  result: z.string(),
})

export type BlockscoutResponse = z.infer<typeof BlockscoutResponse>
const BlockscoutResponse = z.union([
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

export type BlockscoutNextPageParams = z.infer<typeof BlockscoutNextPageParams>

export const BlockscoutNextPageParams = z.object({
  block_number: z.number(),
  index: z.number(),
  items_count: z.number(),
  transaction_index: z.number(),
})

export type BlockscoutAddressParam = z.infer<typeof BlockscoutAddressParam>

export const BlockscoutAddressParam = z.object({
  ens_domain_name: z.string().nullable(),
  hash: z.string(),
  implementation_name: z.string().nullish(),
  is_contract: z.boolean(),
  is_verified: z.boolean(),
  metadata: z.unknown().nullable(),
  name: z.string().nullable(),
  private_tags: z.array(z.unknown()),
  public_tags: z.array(z.unknown()),
  watchlist_names: z.array(z.unknown()),
})

export type BlockscoutInternalTransaction = z.infer<
  typeof BlockscoutInternalTransaction
>

export const BlockscoutInternalTransaction = z.object({
  block_index: z.number(),
  block_number: z.number(),
  created_contract: z.unknown().nullable(),
  error: z.unknown().nullable(),
  from: BlockscoutAddressParam,
  gas_limit: z.string(),
  index: z.number(),
  success: z.boolean(),
  timestamp: stringAs((s) => UnixTime.fromDate(new Date(s))),
  to: z.nullable(BlockscoutAddressParam),
  transaction_hash: z.string(),
  type: z.string(),
  value: z.string(),
})

export type BlockscoutGetInternalTransactionsResponse = z.infer<
  typeof BlockscoutGetInternalTransactionsResponse
>

export const BlockscoutGetInternalTransactionsResponse = z.object({
  items: z.array(BlockscoutInternalTransaction),
  next_page_params: z.nullable(BlockscoutNextPageParams),
})
