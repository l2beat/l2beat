import { stringAsInt } from '@l2beat/shared-pure'
import { z } from 'zod'

export const BlockTimestampResponse = z.union([
  z
    .object({
      blockNumber: z.coerce.number(),
    })
    .transform((b) => b.blockNumber),
  stringAsInt(),
])

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

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
export const EtherscanResponse = z.object({
  message: z.enum(['OK', 'NOTOK']),
  result: z.unknown(),
})
