import { EthereumAddress } from '@l2beat/shared-pure'
import * as z from 'zod'

export type PermissionConfiguration = RawPermissionConfiguration & {
  target: EthereumAddress
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
] as const

export type Permission = z.infer<typeof Permission>
export const Permission = z.enum([
  ...RolePermissionEntries,
  ...BasePermissionEntries,
])

export type RawPermissionConfiguration = z.infer<
  typeof RawPermissionConfiguration
>
export const RawPermissionConfiguration = z.object({
  type: Permission,
  delay: z.union([z.number(), z.string()]).default(0),
  description: z.string().optional(),
  condition: z.string().optional(),
  role: z.string().optional(),
})

export type ContractPermissionField = z.infer<typeof ContractPermissionField>
export const ContractPermissionField = z.object({
  permissions: z.array(RawPermissionConfiguration).optional(),
})

export type ContractPermission = z.infer<typeof ContractPermission>
export const ContractPermission = z.object({
  canActIndependently: z.optional(z.boolean()),
  fields: z.record(z.string(), ContractPermissionField).default({}),
})

export type PermissionsConfig = z.infer<typeof PermissionsConfig>
export const PermissionsConfig = z.object({
  overrides: z.optional(
    z.record(
      z.string().refine((key) => EthereumAddress.check(key), {
        message: 'Invalid Ethereum address',
      }),
      ContractPermission,
    ),
  ),
})
