import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod/v4'

export type ContractFieldSeverity = z.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = z.enum(['HIGH', 'LOW'])

export type ContractValueType = z.infer<typeof ContractValueType>
export const ContractValueType = z.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type ColorContractField = z.infer<typeof ColorContractField>
export const ColorContractField = z.object({
  description: z.string().optional(),
  severity: z.optional(ContractFieldSeverity),
  type: z.union([ContractValueType, z.array(ContractValueType)]).optional(),
})

export type ExternalReference = z.infer<typeof ExternalReference>
export const ExternalReference = z.object({
  text: z.string(),
  href: z.string(),
})

export type DiscoveryCategory = z.infer<typeof DiscoveryCategory>
export const DiscoveryCategory = z.object({
  name: z.string(),
  priority: z.number(),
})

export type ColorContract = z.infer<typeof ColorContract>
export const ColorContract = z.object({
  displayName: z.string().optional(),
  categories: z.optional(z.record(z.string(), DiscoveryCategory)),
  category: z.optional(z.string()),
  description: z.optional(z.string()),
  references: z.optional(z.array(ExternalReference)),
  fields: z.preprocess(
    (val) => (val == null ? {} : val),
    z.record(z.string(), ColorContractField),
  ),
  manualSourcePaths: z.preprocess(
    (val) => (val == null ? {} : val),
    z.record(z.string(), z.string()),
  ),
})

export type ColorConfig = z.infer<typeof ColorConfig>
export const ColorConfig = z.object({
  categories: z.optional(z.record(z.string(), DiscoveryCategory)),
  names: z.optional(
    z.record(
      stringAs(EthereumAddress).transform((a) => a.toString()),
      z.string(),
    ),
  ),
  overrides: z.optional(
    z.record(
      z.string().refine((key) => EthereumAddress.check(key), {
        message: 'Invalid Ethereum address',
      }),
      ColorContract,
    ),
  ),
})
