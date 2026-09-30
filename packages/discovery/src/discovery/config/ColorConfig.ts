import { v } from '@l2beat/validate'
import { AddressKey } from './AddressKey'
import { mapRecord, pickByShape, resolveByShape } from './resolveUtils'

export type ContractFieldSeverity = v.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = v.enum(['HIGH', 'MEDIUM', 'LOW'])

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

export type CriticalWindow = v.infer<typeof CriticalWindow>
export const CriticalWindow = v.union([
  v.strictObject({
    sinceTimestamp: v.number(),
    untilTimestamp: v.number().optional(),
  }),
  v.strictObject({
    sinceTimestamp: v.number().optional(),
    untilTimestamp: v.number(),
  }),
])

export type CriticalFlag = v.infer<typeof CriticalFlag>
export const CriticalFlag = v.union([v.literal(true), CriticalWindow])

export const _ColorContract = {
  displayName: v.string().optional(),
  categories: v.record(v.string(), DiscoveryCategory).optional(),
  category: v.string().optional(),
  critical: CriticalFlag.optional(),
  description: v.string().optional(),
  references: v.array(ExternalReference).optional(),
  fields: v.record(v.string(), ColorContractField).optional(),
  manualSourcePaths: v.record(v.string(), v.string()).optional(),
}
export type ColorContractLayer = v.infer<typeof ColorContractLayer>
export const ColorContractLayer = v.object(_ColorContract)

export type ColorContract = ReturnType<typeof resolveColorContract>
export const ColorContract = ColorContractLayer.transform(resolveColorContract)

export function resolveColorContract(layer: ColorContractLayer) {
  const contract = resolveByShape(_ColorContract, layer, {
    fields: {},
    manualSourcePaths: {},
  })
  return {
    ...contract,
    fields: mapRecord(contract.fields, (field) =>
      pickByShape(_ColorContractField, field),
    ),
  }
}

export const _ColorConfig = {
  archived: v.boolean().optional(),
  categories: v.record(v.string(), DiscoveryCategory).optional(),
  names: v.record(AddressKey, v.string()).optional(),
  overrides: v.record(AddressKey, ColorContractLayer).optional(),
}
export type ColorConfigLayer = v.infer<typeof ColorConfigLayer>
export const ColorConfigLayer = v.object(_ColorConfig)

export type ColorConfig = ReturnType<typeof resolveColorConfig>
export const ColorConfig = ColorConfigLayer.transform(resolveColorConfig)

export function resolveColorConfig(layer: ColorConfigLayer) {
  const { overrides, ...config } = pickByShape(_ColorConfig, layer)
  return {
    ...config,
    ...(overrides && { overrides: mapRecord(overrides, resolveColorContract) }),
  }
}
