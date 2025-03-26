import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import { UserHandlerDefinition } from '../handlers/user'

export type StructureContractField = z.infer<typeof StructureContractField>
export const StructureContractField = z.object({
  handler: z.optional(UserHandlerDefinition),
  template: z.string().optional(),
  returnType: z.string().optional(),
})

export type RawPermissionConfiguration = z.infer<
  typeof RawPermissionConfiguration
>

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

export type ContractFieldSeverity = z.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = z.enum(['HIGH', 'MEDIUM', 'LOW'])

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
  permissions: z.array(RawPermissionConfiguration).optional(),
  type: z.union([ContractValueType, z.array(ContractValueType)]).optional(),
})

export type DiscoveryContractField = z.infer<typeof DiscoveryContractField>
export const DiscoveryContractField =
  StructureContractField.merge(ColorContractField)

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

export type StructureContract = z.infer<typeof StructureContract>
export const StructureContract = z.object({
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
  methods: z.record(z.string(), z.string()).default({}),
  manualSourcePaths: z.record(z.string()).default({}),
  types: z.record(z.string(), DiscoveryCustomType).default({}),
})

export type ColorContract = z.infer<typeof ColorContract>
export const ColorContract = z.object({
  categories: z.optional(z.record(z.string(), DiscoveryCategory)),
  category: z.optional(z.string()),
  description: z.optional(z.string()),
  references: z.optional(z.array(ExternalReference)),
})

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = StructureContract.merge(ColorContract)

export type StructureConfig = z.infer<typeof StructureConfig>
export const StructureConfig = z.object({
  import: z.optional(z.array(z.string())),
  maxAddresses: z.optional(z.number().positive()),
  maxDepth: z.optional(z.number()),
  overrides: z.optional(
    z.record(
      z.string().refine((key) => EthereumAddress.check(key), {
        message: 'Invalid Ethereum address',
      }),
      DiscoveryContract,
    ),
  ),
  sharedModules: z.optional(z.array(z.string())),
  types: z.optional(z.record(z.string(), DiscoveryCustomType)),
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
})

export type CommonDiscoveryConfig = z.infer<typeof CommonDiscoveryConfig>
export const CommonDiscoveryConfig = StructureConfig.merge(ColorConfig)

export type RawDiscoveryConfig = z.infer<typeof RawDiscoveryConfig>
export const RawDiscoveryConfig = CommonDiscoveryConfig.extend({
  name: z.string().min(1),
  chain: z.string().min(1),
  initialAddresses: z.array(stringAs(EthereumAddress)),
})
