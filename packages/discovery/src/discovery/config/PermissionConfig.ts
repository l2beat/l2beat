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

export type Permission = v.infer<typeof Permission>
export const Permission = v.enum(BasePermissionEntries)

export type RawPermissionConfiguration = v.infer<
  typeof RawPermissionConfiguration
>

export type EffectDefinition = v.infer<typeof EffectDefinition>
export const EffectDefinition = v.object({
  id: v.string(),
  description: v.string().optional(),
  mitigation: v.string().optional(),
})

export type PermissionGroup = v.infer<typeof PermissionGroup>
export const PermissionGroup = v.object({
  name: v.string(),
  memberName: v.string(),
  threshold: v.union([v.number(), v.string()]).default(1),
  admin: v.string().optional(),
})

export const RawPermissionConfiguration = v.object({
  id: v.string().optional(),
  type: Permission,
  delay: v.union([v.number(), v.string()]).default(0),
  description: v.string().optional(),
  condition: v.string().optional(),
  role: v.string().optional(),
  group: PermissionGroup.optional(),
  effects: v.array(EffectDefinition).optional(),
})

export type EffectRuleInput = v.infer<typeof EffectRuleInput>
export const EffectRuleInput = v.object({
  field: v.string().optional(),
  effect: v.string(),
})

export type EffectRule = v.infer<typeof EffectRule>
export const EffectRule = v.object({
  id: v.string(),
  inputs: v.array(EffectRuleInput),
  output: v.string(),
  /** How this component locally transforms the input effects into its output. */
  description: v.string(),
  /** Externally meaningful project or user consequence of a terminal output. */
  impact: v.string().optional(),
  /** Protection that limits the consequence, or functionality that remains. */
  mitigation: v.string().optional(),
  terminal: v.boolean().default(false),
})

export type EffectAssumption = v.infer<typeof EffectAssumption>
export const EffectAssumption = v.object({
  field: v.string(),
  name: v.string().optional(),
  description: v.string().optional(),
  effects: v.array(EffectDefinition),
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
  effectRules: v.array(EffectRule).optional(),
  effectAssumptions: v.array(EffectAssumption).optional(),
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
