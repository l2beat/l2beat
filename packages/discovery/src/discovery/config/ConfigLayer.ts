import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { BlipSexp } from '../../blip/type'
import { validateBlip } from '../../blip/validateBlip'
import { UserHandlerDefinition } from '../handlers/user'
import {
  type ColorConfig,
  type ColorContract,
  type ColorContractField,
  ContractFieldSeverity,
  ContractValueType,
  CriticalFlag,
  DiscoveryCategory,
  ExternalReference,
} from './ColorConfig'
import { colorFieldPolicy } from './colorUtils'
import {
  type MergePolicy,
  mergeIgnoreRelatives,
  mergeRecordByName,
  mergeRecordShallow,
  mergeWithPolicy,
  overrideScalar,
  replaceArray,
  unionStrings,
} from './mergeUtils'
import {
  type ContractPermission,
  type ContractPermissionField,
  type PermissionsConfig,
  RawPermissionConfiguration,
} from './PermissionConfig'
import { permissionFieldPolicy } from './permissionUtils'
import {
  DiscoveryCustomType,
  Entrypoint,
  ManualProxyType,
  type StructureConfig,
  type StructureContract,
  type StructureContractField,
} from './StructureConfig'
import { assertHandlerOrCopy, structureFieldPolicy } from './structureUtils'

export type FieldLayer = v.infer<typeof FieldLayer>
export const FieldLayer = v.object({
  handler: UserHandlerDefinition.optional(),
  template: v.string().optional(),
  copy: v.string().optional(),
  edit: v
    .unknown()
    .check((v): v is BlipSexp => validateBlip(v))
    .optional(),
  description: v.string().optional(),
  severity: ContractFieldSeverity.optional(),
  type: v.union([ContractValueType, v.array(ContractValueType)]).optional(),
  permissions: v.array(RawPermissionConfiguration).optional(),
})

export type ContractLayer = v.infer<typeof ContractLayer>
export const ContractLayer = v.object({
  discoverLibraries: v.boolean().optional(),
  canActIndependently: v.boolean().optional(),
  ignoreDiscovery: v.boolean().optional(),
  proxyType: ManualProxyType.optional(),
  ignoreInWatchMode: v.array(v.string()).optional(),
  ignoreMethods: v.array(v.string()).optional(),
  ignoreRelatives: v.union([v.array(v.string()), v.literal(true)]).optional(),
  fields: v.record(v.string(), FieldLayer).optional(),
  methods: v.record(v.string(), v.string()).optional(),
  manualSourcePaths: v.record(v.string(), v.string()).optional(),
  types: v.record(v.string(), DiscoveryCustomType).optional(),
  displayName: v.string().optional(),
  categories: v.record(v.string(), DiscoveryCategory).optional(),
  category: v.string().optional(),
  critical: CriticalFlag.optional(),
  description: v.string().optional(),
  references: v.array(ExternalReference).optional(),
})

const addressKey = v
  .string()
  .transform((v) => ChainSpecificAddress(v).toString())

export type ConfigLayer = v.infer<typeof ConfigLayer>
export const ConfigLayer = v.object({
  name: v.string().optional(),
  discoverLibraries: v.boolean().optional(),
  initialAddresses: v
    .array(v.string().transform((v) => ChainSpecificAddress(v)))
    .optional(),
  maxAddresses: v.number().optional(),
  maxDepth: v.number().optional(),
  overrides: v.record(addressKey, ContractLayer).optional(),
  types: v.record(v.string(), DiscoveryCustomType).optional(),
  entrypoints: v
    .record(
      v.string().transform((v) => ChainSpecificAddress(v)),
      Entrypoint,
    )
    .optional(),
  archived: v.boolean().optional(),
  categories: v.record(v.string(), DiscoveryCategory).optional(),
  names: v.record(addressKey, v.string()).optional(),
})

type SameKeys<A, B> = [A] extends [B] ? ([B] extends [A] ? true : never) : never

type SchemaFieldKeys =
  | keyof StructureContractField
  | keyof ColorContractField
  | keyof ContractPermissionField
type SchemaContractKeys =
  | keyof StructureContract
  | keyof ColorContract
  | keyof ContractPermission
type SchemaConfigKeys = Exclude<
  keyof StructureConfig | keyof ColorConfig | keyof PermissionsConfig,
  'import'
>

export const fieldLayerCoversSchemas: SameKeys<
  SchemaFieldKeys,
  keyof FieldLayer
> = true
export const contractLayerCoversSchemas: SameKeys<
  SchemaContractKeys,
  keyof ContractLayer
> = true
export const configLayerCoversSchemas: SameKeys<
  SchemaConfigKeys,
  keyof ConfigLayer
> = true

export function mergeConfigLayer(
  base: ConfigLayer,
  override: ConfigLayer,
): ConfigLayer {
  return mergeWithPolicy(configLayerPolicy, base, override)
}

function mergeFieldLayer(base: FieldLayer, override: FieldLayer): FieldLayer {
  const merged = mergeWithPolicy(fieldLayerPolicy, base, override)
  assertHandlerOrCopy(merged)
  return merged
}

function mergeContractLayer(
  base: ContractLayer,
  override: ContractLayer,
): ContractLayer {
  return mergeWithPolicy(contractLayerPolicy, base, override)
}

const fieldLayerPolicy: MergePolicy<FieldLayer> = {
  ...structureFieldPolicy,
  ...colorFieldPolicy,
  ...permissionFieldPolicy,
}

const contractLayerPolicy: MergePolicy<ContractLayer> = {
  discoverLibraries: overrideScalar,
  canActIndependently: overrideScalar,
  ignoreDiscovery: overrideScalar,
  proxyType: overrideScalar,
  ignoreInWatchMode: unionStrings,
  ignoreMethods: unionStrings,
  ignoreRelatives: mergeIgnoreRelatives,
  fields: mergeRecordByName(mergeFieldLayer),
  methods: mergeRecordShallow,
  manualSourcePaths: mergeRecordShallow,
  types: mergeRecordShallow,
  displayName: overrideScalar,
  categories: mergeRecordShallow,
  category: overrideScalar,
  critical: (base, override) => override ?? base,
  description: overrideScalar,
  references: replaceArray,
}

const configLayerPolicy: MergePolicy<ConfigLayer> = {
  name: overrideScalar,
  discoverLibraries: overrideScalar,
  initialAddresses: replaceArray,
  maxAddresses: overrideScalar,
  maxDepth: overrideScalar,
  overrides: mergeRecordByName(mergeContractLayer),
  types: mergeRecordShallow,
  entrypoints: mergeRecordShallow,
  archived: overrideScalar,
  categories: mergeRecordShallow,
  names: mergeRecordShallow,
}
