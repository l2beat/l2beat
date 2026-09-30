import { v } from '@l2beat/validate'
import { AddressKey } from './AddressKey'
import {
  _ColorConfig,
  _ColorContract,
  _ColorContractField,
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
  _ContractPermission,
  _ContractPermissionField,
  _PermissionsConfig,
} from './PermissionConfig'
import { permissionFieldPolicy } from './permissionUtils'
import {
  _StructureConfig,
  _StructureContract,
  _StructureContractField,
  HANDLER_OR_COPY_MESSAGE,
  hasHandlerOrCopy,
} from './StructureConfig'
import { assertHandlerOrCopy, structureFieldPolicy } from './structureUtils'

export type FieldLayer = v.infer<typeof FieldLayer>
export const FieldLayer = v
  .object({
    ..._StructureContractField,
    ..._ColorContractField,
    ..._ContractPermissionField,
  })
  .check(hasHandlerOrCopy, HANDLER_OR_COPY_MESSAGE)

export type ContractLayer = v.infer<typeof ContractLayer>
export const ContractLayer = v.object({
  ..._StructureContract,
  ..._ColorContract,
  ..._ContractPermission,
  fields: v.record(v.string(), FieldLayer).optional(),
})

export type ConfigLayer = v.infer<typeof ConfigLayer>
export const ConfigLayer = v.object({
  ..._StructureConfig,
  ..._ColorConfig,
  ..._PermissionsConfig,
  overrides: v.record(AddressKey, ContractLayer).optional(),
})

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
