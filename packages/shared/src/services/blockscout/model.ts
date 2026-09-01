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

const NullableString = v.union([v.string(), v.null()])

const BlockscoutCompilerSettings = v.object({
  optimizer: v
    .object({
      enabled: v.boolean().optional(),
      runs: v.number().optional(),
    })
    .optional(),
  evmVersion: v.string().optional(),
  viaIR: v.boolean().optional(),
  metadata: v
    .object({
      bytecodeHash: v.string().optional(),
      useLiteralContent: v.boolean().optional(),
      appendCBOR: v.boolean().optional(),
    })
    .optional(),
  debug: v
    .object({
      revertStrings: v.string().optional(),
      debugInfo: v.array(v.string()).optional(),
    })
    .optional(),
  remappings: v.array(v.string()).optional(),
  libraries: v.unknown().optional(),
})

export type BlockscoutSmartContract = v.infer<typeof BlockscoutSmartContract>

export const BlockscoutSmartContract = v.object({
  is_verified: v.boolean(),
  name: NullableString.optional(),
  compiler_version: NullableString.optional(),
  optimization_enabled: v.boolean().optional(),
  optimization_runs: v.union([v.number(), v.null()]).optional(),
  optimizations_runs: v.union([v.number(), v.null()]).optional(),
  evm_version: NullableString.optional(),
  abi: v.union([v.string(), v.array(v.unknown()), v.null()]).optional(),
  source_code: NullableString.optional(),
  file_path: NullableString.optional(),
  compiler_settings: v.union([BlockscoutCompilerSettings, v.null()]).optional(),
  constructor_args: NullableString.optional(),
  additional_sources: v
    .union([
      v.array(
        v.object({
          file_path: v.string(),
          source_code: v.string(),
        }),
      ),
      v.null(),
    ])
    .optional(),
  external_libraries: v
    .union([
      v.array(
        v.object({
          name: v.string(),
          address_hash: v.string(),
        }),
      ),
      v.null(),
    ])
    .optional(),
  language: NullableString.optional(),
})

export type BlockscoutAddressInfo = v.infer<typeof BlockscoutAddressInfo>

export const BlockscoutAddressInfo = v.object({
  creation_transaction_hash: NullableString.optional(),
})
