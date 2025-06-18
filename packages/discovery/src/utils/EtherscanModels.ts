import { EthereumAddress, Hash256, type json } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type EtherscanSuccessResponse = v.infer<typeof EtherscanSuccessResponse>
const EtherscanSuccessResponse = v.object({
  message: v.literal('OK'),
  result: v.unknown(),
})

export type EtherscanErrorResponse = v.infer<typeof EtherscanErrorResponse>
const EtherscanErrorResponse = v.object({
  message: v.literal('NOTOK'),
  result: v.string(),
})

export type EtherscanResponse = v.infer<typeof EtherscanResponse>
const EtherscanResponse = v.union([
  EtherscanSuccessResponse,
  EtherscanErrorResponse,
])

export function parseEtherscanResponse(response: json): EtherscanResponse {
  try {
    return EtherscanResponse.parse(response)
  } catch {
    throw new TypeError('Invalid Etherscan response')
  }
}

export function tryParseEtherscanResponse(
  response: json,
): EtherscanResponse | undefined {
  try {
    return parseEtherscanResponse(response)
  } catch {
    return undefined
  }
}

export type ContractSource = v.infer<typeof ContractSource>
export const ContractSource = v.object({
  SourceCode: v.string(),
  ABI: v.string(),
  ContractName: v.string(),
  CompilerVersion: v.string(),
  OptimizationUsed: v.string(),
  Runs: v.string(),
  ConstructorArguments: v.string(),
  EVMVersion: v.string(),
  Library: v.string(),
  LicenseType: v.string(),
  Proxy: v.string(),
  Implementation: v.string(),
  SwarmSource: v.string(),
})

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
  methodId: v.string(),
  functionName: v.string(),
})

export const OneTransactionListResult = v
  .array(TransactionListEntry)
  .check((a) => a.length === 1)
export const TransactionListResult = v.array(TransactionListEntry)
