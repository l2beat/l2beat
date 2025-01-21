import {
  EthereumAddress,
  Hash256,
  UnixTime,
  type json,
  stringAs,
} from '@l2beat/shared-pure'
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

export function parseBlockscoutResponse(response: json): BlockscoutResponse {
  try {
    return BlockscoutResponse.parse(response)
  } catch {
    throw new TypeError('Invalid Blockscout response')
  }
}

export const BlockscoutGetBlockNoByTime = z.object({
  blockNumber: z.coerce.number(),
})

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
  implementation_name: z.string().nullable(),
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
  block: z.number(),
  block_index: z.number(),
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

export type ContractSource = z.infer<typeof ContractSource>
export const ContractSource = z.object({
  SourceCode: z.string(),
  ABI: z.string(),
  AdditionalSources: z.array(
    z.object({
      Filename: z.string(),
      SourceCode: z.string(),
    }),
  ),
  ContractName: z.string(),
  FileName: z.string(),
  CompilerVersion: z.string(),
  OptimizationUsed: z.string(),
  OptimizationRuns: z.number(),
  EVMVersion: z.string(),
  CompilerSettings: z.object({
    libraries: z.record(z.string()),
    optimizer: z.object({
      enabled: z.boolean(),
      runs: z.number(),
    }),
    remappings: z.optional(z.array(z.string())),
  }),
})

export type UnverifiedContractSource = z.infer<typeof UnverifiedContractSource>
export const UnverifiedContractSource = z.object({
  Address: z.string(),
})
export const UnverifiedContractSourceResult = z.array(UnverifiedContractSource)

export const ContractSourceResult = z.array(ContractSource).length(1)

export type ContractCreatorAndCreationTxHash = z.infer<
  typeof ContractCreatorAndCreationTxHash
>
export const ContractCreatorAndCreationTxHash = z.object({
  contractAddress: stringAs(EthereumAddress),
  contractCreator: z.union([
    stringAs(EthereumAddress),
    z.literal('GENESIS').transform(() => EthereumAddress.ZERO),
    z.literal('genesis').transform(() => EthereumAddress.ZERO),
  ]),
  txHash: z.union([
    stringAs(Hash256),
    z
      .string()
      .startsWith('GENESIS_')
      .transform(() => Hash256.ZERO),
    z
      .string()
      .startsWith('genesis_')
      .transform(() => Hash256.ZERO),
  ]),
})

export const ContractCreatorAndCreationTxHashResult = z
  .array(ContractCreatorAndCreationTxHash)
  .length(1)

export const TransactionListEntry = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  nonce: z.string(),
  blockHash: z.string(),
  transactionIndex: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  gas: z.string(),
  gasPrice: z.string(),
  isError: z.string(),
  txreceipt_status: z.string(),
  input: z.string(),
  contractAddress: z.string(),
  cumulativeGasUsed: z.string(),
  gasUsed: z.string(),
  confirmations: z.string(),
})

export const OneTransactionListResult = z.array(TransactionListEntry).length(1)
export const TransactionListResult = z.array(TransactionListEntry)
