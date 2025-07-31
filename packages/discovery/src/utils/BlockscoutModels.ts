import {
  EthereumAddress,
  Hash256,
  type json,
  UnixTime,
} from '@l2beat/shared-pure'
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

export function parseBlockscoutResponse(response: json): BlockscoutResponse {
  try {
    return BlockscoutResponse.parse(response)
  } catch {
    throw new TypeError('Invalid Blockscout response')
  }
}

export const BlockscoutGetBlockNoByTime = v.object({
  blockNumber: v.unknown().transform((v) => Number(v)),
})

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
  implementation_name: v.union([v.string(), v.null()]),
  is_contract: v.boolean(),
  is_verified: v.boolean(),
  metadata: v.union([v.unknown(), v.null()]),
  name: v.union([v.string(), v.null()]),
  private_tags: v.array(v.unknown()),
  public_tags: v.array(v.unknown()),
  watchlist_names: v.array(v.unknown()),
})

export type BlockscoutInternalTransaction = v.infer<
  typeof BlockscoutInternalTransaction
>

export const BlockscoutInternalTransaction = v.object({
  block: v.number(),
  block_index: v.number(),
  created_contract: v.union([v.unknown(), v.null()]),
  error: v.union([v.unknown(), v.null()]),
  from: BlockscoutAddressParam,
  gas_limit: v.string(),
  index: v.number(),
  success: v.boolean(),
  timestamp: v.string().transform((t) => UnixTime.fromDate(new Date(t))),
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

export type ContractSource = v.infer<typeof ContractSource>
export const ContractSource = v.object({
  SourceCode: v.string(),
  ABI: v.string(),
  AdditionalSources: v
    .array(
      v.object({
        Filename: v.string(),
        SourceCode: v.string(),
      }),
    )
    .optional(),
  ContractName: v.string(),
  FileName: v.string(),
  CompilerVersion: v.string(),
  OptimizationUsed: v.string(),
  OptimizationRuns: v.number().optional(),
  EVMVersion: v.string(),
  CompilerSettings: v
    .object({
      libraries: v.record(v.string(), v.string()),
      optimizer: v.object({
        enabled: v.boolean(),
        runs: v.number(),
      }),
      remappings: v.array(v.string()).optional(),
    })
    .optional(),
})

export type UnverifiedContractSource = v.infer<typeof UnverifiedContractSource>
export const UnverifiedContractSource = v.object({
  Address: v.string(),
})
export const UnverifiedContractSourceResult = v.array(UnverifiedContractSource)

export const ContractSourceResult = v
  .array(ContractSource)
  .check((a) => a.length === 1)

export type ContractCreatorAndCreationTxHash = v.infer<
  typeof ContractCreatorAndCreationTxHash
>
export const ContractCreatorAndCreationTxHash = v.object({
  contractAddress: v.string().transform((v) => EthereumAddress(v)),
  contractCreator: v.union([
    v.string().transform((v) => EthereumAddress(v)),
    v.literal('GENESIS').transform(() => EthereumAddress.ZERO),
    v.literal('genesis').transform(() => EthereumAddress.ZERO),
  ]),
  txHash: v.union([
    v.string().transform((v) => Hash256(v)),
    v
      .string()
      .check((v) => v.startsWith('GENESIS_'))
      .transform(() => Hash256.ZERO),
    v
      .string()
      .check((v) => v.startsWith('genesis_'))
      .transform(() => Hash256.ZERO),
  ]),
})

export const ContractCreatorAndCreationTxHashResult = v
  .array(ContractCreatorAndCreationTxHash)
  .check((a) => a.length === 1)

export const TransactionListEntry = v.object({
  blockNumber: v.string(),
  timeStamp: v.string(),
  hash: v.string(),
  nonce: v.string(),
  blockHash: v.string(),
  transactionIndex: v.string(),
  from: v.string(),
  to: v.string(),
  value: v.string(),
  gas: v.string(),
  gasPrice: v.string(),
  isError: v.string(),
  txreceipt_status: v.string(),
  input: v.string(),
  contractAddress: v.string(),
  cumulativeGasUsed: v.string(),
  gasUsed: v.string(),
  confirmations: v.string(),
})

export const OneTransactionListResult = v
  .array(TransactionListEntry)
  .check((a) => a.length === 1)
export const TransactionListResult = v.array(TransactionListEntry)
