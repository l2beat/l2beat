import { v } from '@l2beat/validate'
import { AddressKey } from './AddressKey'
import { resolveConfig, resolveContract } from './resolveUtils'

export const BasePermissionEntries = [
  'member',
  'act',
  'interact',
  'upgrade',
] as const

export type Permission = v.infer<typeof Permission>
export const Permission = v.enum(BasePermissionEntries)

export type RawPermissionConfiguration = v.infer<
  typeof RawPermissionConfiguration
>
export const RawPermissionConfiguration = v.object({
  type: Permission,
  delay: v.union([v.number(), v.string()]).default(0),
  description: v.string().optional(),
  condition: v.string().optional(),
  role: v.string().optional(),
})

export type ContractPermissionField = v.infer<typeof ContractPermissionField>
export const _ContractPermissionField = {
  permissions: v.array(RawPermissionConfiguration).optional(),
}
export const ContractPermissionField = v.object(_ContractPermissionField)

export const _ContractPermission = {
  canActIndependently: v.boolean().optional(),
  fields: v.record(v.string(), ContractPermissionField).optional(),
}
export type ContractPermissionLayer = v.infer<typeof ContractPermissionLayer>
export const ContractPermissionLayer = v.object(_ContractPermission)

export type ContractPermission = ReturnType<typeof resolveContractPermission>
export const ContractPermission = ContractPermissionLayer.transform(
  resolveContractPermission,
)

export function resolveContractPermission(layer: ContractPermissionLayer) {
  return resolveContract(_ContractPermission, _ContractPermissionField, layer, {
    fields: {},
  })
}

export const _PermissionsConfig = {
  overrides: v.record(AddressKey, ContractPermissionLayer).optional(),
}
export type PermissionsConfigLayer = v.infer<typeof PermissionsConfigLayer>
export const PermissionsConfigLayer = v.object(_PermissionsConfig)

export type PermissionsConfig = ReturnType<typeof resolvePermissionsConfig>
export const PermissionsConfig = PermissionsConfigLayer.transform(
  resolvePermissionsConfig,
)

export function resolvePermissionsConfig(layer: PermissionsConfigLayer) {
  return resolveConfig(_PermissionsConfig, layer, {}, resolveContractPermission)
}
