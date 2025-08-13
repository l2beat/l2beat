import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type ContractFieldSeverity = v.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = v.enum(['HIGH', 'LOW'])

export type ContractValueType = v.infer<typeof ContractValueType>
export const ContractValueType = v.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type ColorContractField = v.infer<typeof ColorContractField>
export const _ColorContractField = {
  description: v.string().optional(),
  severity: ContractFieldSeverity.optional(),
  type: v.union([ContractValueType, v.array(ContractValueType)]).optional(),
}
export const ColorContractField = v.object(_ColorContractField)

export type ExternalReference = v.infer<typeof ExternalReference>
export const ExternalReference = v.object({
  text: v.string(),
  href: v.string(),
})

export type DiscoveryCategory = v.infer<typeof DiscoveryCategory>
export const DiscoveryCategory = v.object({
  name: v.string(),
  priority: v.number(),
})

export type ColorContract = v.infer<typeof ColorContract>
export const _ColorContract = {
  displayName: v.string().optional(),
  categories: v.record(v.string(), DiscoveryCategory).optional(),
  category: v.string().optional(),
  description: v.string().optional(),
  references: v.array(ExternalReference).optional(),
  fields: v.record(v.string(), ColorContractField).default({}),
  manualSourcePaths: v.record(v.string(), v.string()).default({}),
}
export const ColorContract = v.object(_ColorContract)

export type ColorConfig = v.infer<typeof ColorConfig>
export const _ColorConfig = {
  categories: v.record(v.string(), DiscoveryCategory).optional(),
  names: v
    .record(
      v.string().transform((v) => ChainSpecificAddress(v).toString()),
      v.string(),
    )
    .optional(),
  overrides: v
    .record(
      v.string().transform((v) => ChainSpecificAddress(v).toString()),
      ColorContract,
    )
    .optional(),
}
export const ColorConfig = v.object({
  archived: v.boolean().optional(),
  ..._ColorConfig,
})
