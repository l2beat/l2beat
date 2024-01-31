import { EthereumAddress, Hash256, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

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
  contractCreator: stringAs(EthereumAddress),
  txHash: stringAs(Hash256),
})

export const ContractCreatorAndCreationTxHashResult = z
  .array(ContractCreatorAndCreationTxHash)
  .length(1)

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

export function parseEtherscanResponse(value: string): EtherscanResponse {
  try {
    const json: unknown = JSON.parse(value)
    return EtherscanResponse.parse(json)
  } catch {
    throw new TypeError('Invalid Etherscan response')
  }
}
