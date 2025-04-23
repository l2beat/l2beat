import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import type { BlipSexp } from '../../blip/type'
import { validateBlip } from '../../blip/validateBlip'
import { UserHandlerDefinition } from '../handlers/user'

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

export type StructureContractField = z.infer<typeof StructureContractField>
export const StructureContractField = z
  .object({
    handler: z.optional(UserHandlerDefinition),
    template: z.string().optional(),
    permissions: z.array(RawPermissionConfiguration).optional(),
    copy: z.string().optional(),
    edit: z
      .unknown()
      .refine(validateBlip)
      .transform((v): BlipSexp => v as BlipSexp)
      .optional(),
  })
  .refine((data) => data.handler === undefined || data.copy === undefined, {
    message:
      'handler and copy cannot both be defined at the same time. They are mutually exclusive.',
    path: ['handler', 'copy'],
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
  fields: z.record(z.string(), StructureContractField).default({}),
  methods: z.record(z.string(), z.string()).default({}),
  manualSourcePaths: z.record(z.string()).default({}),
  types: z.record(z.string(), DiscoveryCustomType).default({}),
})

export type StructureConfig = z.infer<typeof StructureConfig>
export const StructureConfig = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  initialAddresses: z.array(stringAs(EthereumAddress)),
  import: z.optional(z.array(z.string())),
  maxAddresses: z.number().positive().default(100),
  maxDepth: z.number().default(6),
  overrides: z.optional(
    z.record(
      z.string().refine((key) => EthereumAddress.check(key), {
        message: 'Invalid Ethereum address',
      }),
      StructureContract,
    ),
  ),
  sharedModules: z.array(z.string()).default([]),
  types: z.optional(z.record(z.string(), DiscoveryCustomType)),
})
