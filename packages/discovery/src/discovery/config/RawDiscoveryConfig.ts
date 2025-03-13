import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import { UserHandlerDefinition } from '../handlers/user'

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
  'relay',
  'aggregatePolygon',
  'operateStarknet',
  'operateStarkEx',
  'governStarknet',
] as const

export const Permission = z.enum([
  ...RolePermissionEntries,
  ...BasePermissionEntries,
])
export type Permission = z.infer<typeof Permission>

export type RawPermissionConfiguration = z.infer<
  typeof RawPermissionConfiguration
>

export const RawPermissionConfiguration = z.object({
  type: Permission,
  delay: z.union([z.number(), z.string()]).default(0),
  description: z.string().optional(),
  condition: z.string().optional(),
})

export type PermissionConfiguration = RawPermissionConfiguration & {
  target: EthereumAddress
  delay: number
}

export type ContractValueType = z.infer<typeof ContractValueType>
export const ContractValueType = z.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type ContractFieldSeverity = z.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = z.enum(['HIGH', 'MEDIUM', 'LOW'])

export type DiscoveryContractField = z.infer<typeof DiscoveryContractField>
export const DiscoveryContractField = z.object({
  handler: z.optional(UserHandlerDefinition),
  description: z.string().optional(),
  severity: z.optional(ContractFieldSeverity),
  returnType: z.string().optional(),
  target: z
    .object({
      template: z.string().optional(),
      permissions: z.array(RawPermissionConfiguration).optional(),
    })
    .optional(),
  type: z.union([ContractValueType, z.array(ContractValueType)]).optional(),
})

export type DiscoveryCustomType = z.infer<typeof DiscoveryCustomType>
export const DiscoveryCustomType = z
  .object({
    typeCaster: z.optional(z.string()),
    arg: z.optional(z.record(z.string(), z.union([z.string(), z.number()]))),
    description: z.optional(z.string()),
    severity: z.optional(ContractFieldSeverity),
  })
  .refine((d) => !(d.arg !== undefined && d.typeCaster === undefined), {
    message: 'typeCaster must be defined if arg is defined',
    path: ['typeCaster'],
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

export type ManualProxyType = z.infer<typeof ManualProxyType>
export const ManualProxyType = z.enum([
  'new Arbitrum proxy',
  'call implementation proxy',
  'zkSync Lite proxy',
  'zkSpace proxy',
  'Eternal Storage proxy',
  'Polygon Extension proxy',
  'Optics Beacon proxy',
  'Axelar proxy',
  'LightLink proxy',
  'Everclear proxy',
  'immutable',
])

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = z.object({
  extends: z.optional(z.string()),
  canActIndependently: z.optional(z.boolean()),
  ignoreDiscovery: z.boolean().default(false),
  proxyType: z.optional(ManualProxyType),
  displayName: z.string().optional(),
  ignoreInWatchMode: z.optional(z.array(z.string())),
  ignoreMethods: z.array(z.string()).default([]),
  ignoreRelatives: z.array(z.string()).default([]),
  fields: z
    .record(z.string().regex(/^\$?[a-z_][a-z\d_]*$/i), DiscoveryContractField)
    .default({}),
  description: z.optional(z.string()),
  // TODO: in fields?
  methods: z.record(z.string(), z.string()).default({}),
  types: z.record(z.string(), DiscoveryCustomType).default({}),
  categories: z.optional(z.record(z.string(), DiscoveryCategory)),
  manualSourcePaths: z.record(z.string()).default({}),
  references: z.optional(z.array(ExternalReference)),
  category: z.optional(z.string()),
})

export type CommonDiscoveryConfig = z.infer<typeof CommonDiscoveryConfig>
export const CommonDiscoveryConfig = z.object({
  categories: z.optional(z.record(z.string(), DiscoveryCategory)),
  maxAddresses: z.optional(z.number().positive()),
  maxDepth: z.optional(z.number()),
  overrides: z.optional(z.record(z.string(), DiscoveryContract)),
  types: z.optional(z.record(z.string(), DiscoveryCustomType)),
  import: z.optional(z.array(z.string())),
  names: z.optional(
    z.record(
      stringAs(EthereumAddress).transform((a) => a.toString()),
      z.string(),
    ),
  ),
  sharedModules: z.optional(z.array(z.string())),
})

export type RawDiscoveryConfig = z.infer<typeof RawDiscoveryConfig>
export const RawDiscoveryConfig = CommonDiscoveryConfig.extend({
  name: z.string().min(1),
  chain: z.string().min(1),
  initialAddresses: z.array(stringAs(EthereumAddress)),
})
