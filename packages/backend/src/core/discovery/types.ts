import { branded, EthereumAddress } from '@l2beat/types'
import { z } from 'zod'

export type ContractValue =
  | string
  | number
  | boolean
  | EthereumAddress
  | ContractValue[]
  | { [key: string]: ContractValue }

export const ContractValue: z.ZodType<ContractValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    branded(z.string(), (n) => EthereumAddress(n)),
    z.array(ContractValue),
    z.record(ContractValue),
  ]),
)

export type ContractParameters = z.infer<typeof ContractParameters>
export const ContractParameters = z.object({
  name: z.string(),
  unverified: z.optional(z.boolean()),
  address: branded(z.string(), (n) => EthereumAddress(n)),
  code: z.optional(z.string()),
  upgradeability: z.object({}),
  values: z.optional(z.record(ContractValue)),
  errors: z.optional(z.record(z.string())),
})

export type ProjectParameters = z.infer<typeof ProjectParameters>
export const ProjectParameters = z.object({
  name: z.string().min(1),
  blockNumber: z.number(),
  contracts: z.array(ContractParameters),
  eoas: z.array(branded(z.string(), (n) => EthereumAddress(n))),
  abis: z.record(z.array(z.string())),
})

export type AnalyzedData = z.infer<typeof AnalyzedData>
export const AnalyzedData = z.object({
  name: z.string(),
  unverified: z.optional(z.boolean()),
  address: branded(z.string(), (n) => EthereumAddress(n)),
  code: z.optional(z.string()),
  upgradeability: z.object({}),
  values: z.optional(z.record(ContractValue)),
  errors: z.optional(z.record(z.string())),
  meta: z.object({
    isEOA: z.boolean(),
    verified: z.boolean(),
    implementationVerified: z.boolean(),
    abi: z.array(z.string()),
    abis: z.record(z.array(z.string())),
  }),
})
