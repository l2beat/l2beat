import { z } from 'zod'

import { EthereumAddress, Hash256, stringAs } from '../../types'

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
export const EtherscanResponse = z.object({
  status: z.enum(['1', '0']),
  message: z.string(),
  result: z.any(),
})

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
