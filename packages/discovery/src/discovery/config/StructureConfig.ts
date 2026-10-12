import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

import type { BlipSexp } from '../../blip/type'
import { validateBlip } from '../../blip/validateBlip'
import { UserHandlerDefinition } from '../handlers/user'
import { AddressKey } from './AddressKey'
import { resolveConfig, resolveContract } from './resolveUtils'

export type ContractFieldSeverity = v.infer<typeof ContractFieldSeverity>
export const ContractFieldSeverity = v.enum(['HIGH', 'MEDIUM', 'LOW'])

export const HANDLER_AND_COPY_EXCLUSIVE_MESSAGE =
  'handler and copy cannot both be defined at the same time. They are mutually exclusive.'

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
  .check(handlerAndCopyAreExclusive, HANDLER_AND_COPY_EXCLUSIVE_MESSAGE)

export function handlerAndCopyAreExclusive(field: {
  handler?: unknown
  copy?: unknown
}): boolean {
  return field.handler === undefined || field.copy === undefined
}

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
  'zkLighter proxy',
  'ZkLink proxy',
  'zkSpace proxy',
  'Eternal Storage proxy',
  'Polygon Extension proxy',
  'Optics Beacon proxy',
  'Axelar proxy',
  'LightLink proxy',
  'Everclear proxy',
  'TaikoFork proxy',
  'NXV proxy',
  'Railgun proxy',
  'immutable',
])

export const _StructureContract = {
  discoverLibraries: v.boolean().optional(),
  canActIndependently: v.boolean().optional(),
  ignoreDiscovery: v.boolean().optional(),
  proxyType: ManualProxyType.optional(),
  ignoreInWatchMode: v.array(v.string()).optional(),
  ignoreMethods: v.array(v.string()).optional(),
  ignoreRelatives: v.union([v.array(v.string()), v.literal(true)]).optional(),
  fields: v.record(v.string(), StructureContractField).optional(),
  methods: v.record(v.string(), v.string()).optional(),
  manualSourcePaths: v.record(v.string(), v.string()).optional(),
  types: v.record(v.string(), DiscoveryCustomType).optional(),
}
export type StructureContractLayer = v.infer<typeof StructureContractLayer>
export const StructureContractLayer = v.object(_StructureContract)

export type StructureContract = ReturnType<typeof resolveStructureContract>
export const StructureContract = StructureContractLayer.transform(
  resolveStructureContract,
)

export function resolveStructureContract(layer: StructureContractLayer) {
  return resolveContract(_StructureContract, _StructureContractField, layer, {
    ignoreDiscovery: false,
    ignoreMethods: [],
    ignoreRelatives: [],
    fields: {},
    methods: {},
    manualSourcePaths: {},
    types: {},
  })
}

export type EntryType = v.infer<typeof EntryType>
export const EntryType = v.enum(['Contract', 'EOA'])

export type Entrypoint = v.infer<typeof Entrypoint>
export const Entrypoint = v.object({
  name: v.string().optional(),
  type: EntryType,
  project: v.string(),
  isLegacy: v.boolean().optional(),
})

export const _EntrypointsFile = {
  entrypoints: v
    .record(
      v.string().transform((v) => ChainSpecificAddress(v)),
      Entrypoint,
    )
    .optional(),
}
export const EntrypointsFile = v.object(_EntrypointsFile)
export type EntrypointsFile = v.infer<typeof EntrypointsFile>

export const ConfigName = v.string().check((v) => v.length >= 1)
export const InitialAddresses = v.array(
  v.string().transform((v) => ChainSpecificAddress(v)),
)

export const _StructureConfig = {
  name: ConfigName.optional(),
  discoverLibraries: v.boolean().optional(),
  initialAddresses: InitialAddresses.optional(),
  maxAddresses: v
    .number()
    .check((x) => x >= 0)
    .optional(),
  maxDepth: v.number().optional(),
  overrides: v.record(AddressKey, StructureContractLayer).optional(),
  types: v.record(v.string(), DiscoveryCustomType).optional(),
  ..._EntrypointsFile,
}
export type StructureConfigLayer = v.infer<typeof StructureConfigLayer>
export const StructureConfigLayer = v.object(_StructureConfig)

export type StructureConfig = ReturnType<typeof resolveStructureConfig>
export const StructureConfig = StructureConfigLayer.transform(
  resolveStructureConfig,
)

export function resolveStructureConfig(layer: StructureConfigLayer) {
  const config = resolveConfig(
    _StructureConfig,
    layer,
    { maxAddresses: 100, maxDepth: Number.POSITIVE_INFINITY },
    resolveStructureContract,
  )
  const { name, initialAddresses } = config
  assert(name !== undefined, 'Discovery config has no name')
  assert(initialAddresses !== undefined, `${name} has no initialAddresses`)
  return { ...config, name, initialAddresses }
}
