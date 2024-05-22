import { ManualProxyType } from '@l2beat/discovery-types'
import { EthereumAddress, stringAs } from '@l2beat/shared-pure'
import * as z from 'zod'

import { UserHandlerDefinition } from '../handlers/user'

export const ValueType = z.enum([
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
  description: z.string().nullable().optional(),
  severity: z.optional(ContractFieldSeverity).nullable(),
  target: z
    .object({
      handler: z.string().nullable().optional(),
    })
    .nullable()
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

export type RawDiscoveryConfig = z.infer<typeof RawDiscoveryConfig>
export const RawDiscoveryConfig = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  initialAddresses: z.array(stringAs(EthereumAddress)),
  maxAddresses: z.optional(z.number().positive()),
  maxDepth: z.optional(z.number().positive()),
  overrides: z.optional(z.record(z.string(), DiscoveryContract)),
  names: z.optional(
    z.record(
      stringAs(EthereumAddress).transform((a) => a.toString()),
      z.string(),
    ),
  ),
  sharedModules: z.optional(z.record(z.string(), z.string())),
})
