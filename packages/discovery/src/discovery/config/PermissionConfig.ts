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
  /** A bound on an effect that still occurs. It never claims prevention. */
  limitation: v.string().optional(),
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

/**
 * Coarse terminal consequences. Multiple categories may describe one impact.
 *
 * - stolen: value is transferred without the rightful user's authorization
 * - lost: value becomes irrecoverable without necessarily benefiting anyone
 * - frozen: the rightful user cannot recover value for an unbounded period
 * - lose value: the claim remains, but its amount or economic value decreases
 * - censored: a specific action is blocked while recovery paths can remain
 * - delayed: a withdrawal remains possible, but later than normally promised
 * - yield stops: principal remains recoverable, but expected accrual stops
 */
export const ImpactCategories = [
  'funds-can-be-stolen',
  'funds-can-be-lost',
  'funds-can-be-frozen',
  'funds-can-lose-value',
  'users-can-be-censored',
  'mev-can-be-extracted',
  'withdrawals-can-be-delayed',
  'yield-can-stop',
] as const

export type ImpactCategory = v.infer<typeof ImpactCategory>
export const ImpactCategory = v.enum(ImpactCategories)

export type EffectRule = v.infer<typeof EffectRule>
export const EffectRule = v.object({
  id: v.string(),
  inputs: v.array(EffectRuleInput),
  output: v.string(),
  /** How this component locally transforms the input effects into its output. */
  description: v.string(),
  /** Externally meaningful project or user consequence of a terminal output. */
  impact: v.string().optional(),
  /** Coarse, multi-label classification of the terminal impact. */
  categories: v.array(ImpactCategory).optional(),
  /** A bound on an effect that still occurs. It never claims prevention. */
  limitation: v.string().optional(),
  /** A positive terminal outcome that remains despite the compromise. */
  protection: v.string().optional(),
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
