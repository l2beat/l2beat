import { EthereumAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { BlipSexp } from '../../blip/type'
import { validateBlip } from '../../blip/validateBlip'
import { UserHandlerDefinition } from '../handlers/user'

export type ContractFieldSeverity = v.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = v.enum(['HIGH', 'LOW'])

export type StructureContractField = v.infer<typeof StructureContractField>
export const _StructureContractField = {
  handler: UserHandlerDefinition.optional(),
  template: v.string().optional(),
  copy: v.string().optional(),
  edit: v
    .unknown()
    .check((v): v is BlipSexp => validateBlip(v))
    .optional(),
}
export const StructureContractField = v
  .object(_StructureContractField)
  .check(
    (data) => data.handler === undefined || data.copy === undefined,
    'handler and copy cannot both be defined at the same time. They are mutually exclusive.',
  )

export type DiscoveryCustomType = v.infer<typeof DiscoveryCustomType>
export const DiscoveryCustomType = v
  .object({
    typeCaster: v.string().optional(),
    arg: v.record(v.string(), v.union([v.string(), v.number()])).optional(),
    description: v.string().optional(),
    severity: ContractFieldSeverity.optional(),
  })
  .check(
    (d) => !(d.arg !== undefined && d.typeCaster === undefined),
    'typeCaster must be defined if arg is defined',
  )

export type ManualProxyType = v.infer<typeof ManualProxyType>
export const ManualProxyType = v.enum([
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
  'TaikoFork proxy',
  'immutable',
])

export type StructureContract = v.infer<typeof StructureContract>
export const _StructureContract = {
  extends: v.string().optional(),
  canActIndependently: v.boolean().optional(),
  ignoreDiscovery: v.boolean().default(false),
  proxyType: ManualProxyType.optional(),
  ignoreInWatchMode: v.array(v.string()).optional(),
  ignoreMethods: v.array(v.string()).default([]),
  ignoreRelatives: v.array(v.string()).default([]),
  fields: v.record(v.string(), StructureContractField).default({}),
  methods: v.record(v.string(), v.string()).default({}),
  manualSourcePaths: v.record(v.string(), v.string()).default({}),
  types: v.record(v.string(), DiscoveryCustomType).default({}),
}
export const StructureContract = v.object(_StructureContract)

export type StructureConfig = v.infer<typeof StructureConfig>
export const _StructureConfig = {
  initialAddresses: v.array(v.string().transform(EthereumAddress)),
  maxAddresses: v
    .number()
    .check((x) => x >= 0)
    .default(100),
  maxDepth: v.number().default(Infinity),
  overrides: v
    .record(
      v.string().transform((v) => EthereumAddress(v).toString()),
      StructureContract,
    )
    .optional(),
  sharedModules: v.array(v.string()).default([]),
  types: v.record(v.string(), DiscoveryCustomType).optional(),
}
// NOTE(radomsk): Big hack, shouldn't be like this
export const StructureConfig = v.object({
  name: v.string().check((v) => v.length >= 1),
  chain: v.string().check((v) => v.length >= 1),
  archived: v.boolean().optional(),
  import: v.array(v.string()).optional(),
  ..._StructureConfig,
})
