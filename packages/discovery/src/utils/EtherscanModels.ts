import {
  EthereumAddress,
  Hash256,
  type json,
  stringAs,
} from '@l2beat/shared-pure'
import { z } from 'zod'

export type EtherscanSuccessResponse = z.infer<typeof EtherscanSuccessResponse>
const EtherscanSuccessResponse = z.object({
  message: z.literal('OK'),
  result: z.unknown(),
})

export type EtherscanErrorResponse = z.infer<typeof EtherscanErrorResponse>
const EtherscanErrorResponse = z.object({
  message: z.literal('NOTOK'),
  result: z.string(),
})

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
const EtherscanResponse = z.union([
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

export type ContractSource = z.infer<typeof ContractSource>
export const ContractSource = z.object({
  SourceCode: z.string(),
  ABI: z.string(),
  ContractName: z.string(),
  CompilerVersion: z.string(),
  OptimizationUsed: z.string(),
  Runs: z.string(),
  ConstructorArguments: z.string(),
  EVMVersion: z.string(),
  Library: z.string(),
  LicenseType: z.string(),
  Proxy: z.string(),
  Implementation: z.string(),
  SwarmSource: z.string(),
})

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
  methodId: z.string(),
  functionName: z.string(),
})

export const OneTransactionListResult = z.array(TransactionListEntry).length(1)
export const TransactionListResult = z.array(TransactionListEntry)
