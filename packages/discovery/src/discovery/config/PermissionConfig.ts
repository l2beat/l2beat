import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type PermissionConfiguration = RawPermissionConfiguration & {
  target: ChainSpecificAddress
  delay: number
}

export const BasePermissionEntries = [
  'member',
  'act',
  'interact',
  'upgrade',
] as const

export const RolePermissionEntries = [
  'challenge',
  'guard',
  'propose',
  'sequence',
  'validate',
  'disperse',
  'relayDA',
  'operateLinea',
  'fastconfirm',
  'validateZkStack',
  'validateBridge',
  'validateBridge2',
  'validateBridge3',
  'relay',
  'aggregatePolygon',
  'operateStarknet',
  'operateStarkEx',
  'governStarknet',
  'metisGameCreator',
  'stateDeleterMetis',
  'hotValidatorHyperliquid',
  'coldValidatorHyperliquid',
  'acrossPropose',
] as const

export type Permission = v.infer<typeof Permission>
export const Permission = v.enum([
  ...RolePermissionEntries,
  ...BasePermissionEntries,
])

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

export type ContractPermission = v.infer<typeof ContractPermission>
export const _ContractPermission = {
  canActIndependently: v.boolean().optional(),
  fields: v.record(v.string(), ContractPermissionField).default({}),
}
export const ContractPermission = v.object(_ContractPermission)

export type PermissionsConfig = v.infer<typeof PermissionsConfig>
export const _PermissionsConfig = {
  overrides: v
    .record(
      v.string().transform((v) => ChainSpecificAddress(v).toString()),
      ContractPermission,
    )
    .optional(),
}
export const PermissionsConfig = v.object(_PermissionsConfig)
