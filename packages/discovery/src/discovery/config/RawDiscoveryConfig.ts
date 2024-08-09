import {
  ContractFieldSeverity,
  ContractValueType,
  ManualProxyType,
  StackCategory,
  StackRole,
} from '@l2beat/discovery-types'
import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import { UserHandlerDefinition } from '../handlers/user'

export type RawPermissionConfiguration = z.infer<
  typeof RawPermissionConfiguration
>
export const RawPermissionConfiguration = z.object({
  type: z.enum(['configure', 'upgrade', 'act']),
  delay: z.union([z.number(), z.string()]).default(0),
})

export type PermissionConfiguration = RawPermissionConfiguration & {
  target: EthereumAddress
  delay: number
}

export type DiscoveryContractField = z.infer<typeof DiscoveryContractField>
export const DiscoveryContractField = z.object({
  handler: z.optional(UserHandlerDefinition),
  description: z.string().optional(),
  severity: z.optional(ContractFieldSeverity),
  returnType: z.string().optional(),
  target: z
    .object({
      description: z.string().optional(),
      template: z.string().optional(),
      role: z.union([StackRole, z.array(StackRole)]).optional(),
      category: z.union([StackCategory, z.array(StackCategory)]).optional(),
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

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = z.object({
  extends: z.optional(z.string()),
  ignoreDiscovery: z.optional(z.boolean()),
  proxyType: z.optional(ManualProxyType),
  displayName: z.string().optional(),
  ignoreInWatchMode: z.optional(z.array(z.string())),
  ignoreMethods: z.optional(z.array(z.string())),
  ignoreRelatives: z.optional(z.array(z.string())),
  fields: z
    .record(z.string().regex(/^\$?[a-z_][a-z\d_]*$/i), DiscoveryContractField)
    .optional(),
  description: z.optional(z.string()),
  // TODO: in fields?
  methods: z.optional(z.record(z.string(), z.string())),
  usedTypes: z.optional(z.array(DiscoveryCustomType)),
})

export type RawDiscoveryConfig = z.infer<typeof RawDiscoveryConfig>
export const RawDiscoveryConfig = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  initialAddresses: z.array(stringAs(EthereumAddress)),
  maxAddresses: z.optional(z.number().positive()),
  maxDepth: z.optional(z.number().positive()),
  overrides: z.optional(z.record(z.string(), DiscoveryContract)),
  types: z.optional(z.record(z.string(), DiscoveryCustomType)),
  names: z.optional(
    z.record(
      stringAs(EthereumAddress).transform((a) => a.toString()),
      z.string(),
    ),
  ),
  sharedModules: z.optional(z.record(z.string(), z.string())),
})
