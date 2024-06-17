import { ManualProxyType } from '@l2beat/discovery-types'
import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import { UserHandlerDefinition } from '../handlers/user'

export type ValueType = z.infer<typeof ValueType>
export const ValueType = z.enum([
  'CODE_CHANGE',
  'L2',
  'EXTERNAL',
  'RISK_PARAMETER',
  'PERMISSION',
])

export type StackRole = z.infer<typeof StackRole>
export const StackRole = z.enum([
  'Sequencer',
  'Proposer',
  'Challenger',
  'Guardian',
  'Validator',
])

export type Permission = z.infer<typeof Permission>
export const Permission = z.enum(['admin', 'owner'])

export type StackCategory = z.infer<typeof StackCategory>
export const StackCategory = z.enum([
  'Core',
  'Gateways&Escrows',
  'Upgrades&Governance',
])

export type ContractFieldSeverity = z.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = z.enum(['HIGH', 'MEDIUM', 'LOW'])

export type DiscoveryContractField = z.infer<typeof DiscoveryContractField>
export const DiscoveryContractField = z.object({
  handler: z.optional(UserHandlerDefinition),
  description: z.string().nullable().optional(),
  displayName: z.string().nullable().optional(),
  severity: z.optional(ContractFieldSeverity).nullable(),
  returnType: z.string().nullable().optional(),
  target: z
    .object({
      description: z.string().nullable().optional(),
      template: z.string().nullable().optional(),
      role: z
        .union([StackRole, z.array(StackRole)])
        .nullable()
        .optional(),
      category: z
        .union([StackCategory, z.array(StackCategory)])
        .nullable()
        .optional(),
      permission: z
        .union([Permission, z.array(Permission)])
        .nullable()
        .optional(),
    })
    .optional(),
  type: z
    .union([ValueType, z.array(ValueType)])
    .nullable()
    .optional(),
})

export type DiscoveryContract = z.infer<typeof DiscoveryContract>
export const DiscoveryContract = z.object({
  extends: z.optional(z.string()),
  ignoreDiscovery: z.optional(z.boolean()),
  proxyType: z.optional(ManualProxyType),
  ignoreInWatchMode: z.optional(z.array(z.string())),
  ignoreMethods: z.optional(z.array(z.string())),
  ignoreRelatives: z.optional(z.array(z.string())),
  fields: z
    .record(z.string().regex(/^[a-z_][a-z\d_]*$/i), DiscoveryContractField)
    .optional(),
  description: z.optional(z.string()),
  // TODO: in fields?
  methods: z.optional(z.record(z.string(), z.string())),
})

export type DiscoveryCustomType = z.infer<typeof DiscoveryCustomType>
export const DiscoveryCustomType = z
  .object({
    typeCaster: z.optional(z.string()),
    arg: z.optional(z.record(z.string(), z.union([z.string(), z.number()]))),
    description: z.optional(z.string()).nullable(),
    severity: z.optional(ContractFieldSeverity).nullable(),
  })
  .refine((d) => !(d.arg !== undefined && d.typeCaster === undefined), {
    message: 'typeCaster must be defined if arg is defined',
    path: ['typeCaster'],
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
