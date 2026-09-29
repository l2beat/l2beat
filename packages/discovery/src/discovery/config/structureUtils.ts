import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  type MergePolicy,
  mergeIgnoreRelatives,
  mergeRecordByName,
  mergeRecordShallow,
  mergeWithPolicy,
  overrideScalar,
  unionStrings,
} from './mergeUtils'
import {
  type StructureConfig,
  StructureContract,
  type StructureContractField,
} from './StructureConfig'

export type StructureContractOverrides = StructureContract & {
  address: ChainSpecificAddress
}

export type StructureContractConfig = StructureContractOverrides & {
  pushValues: (arg: StructureContract) => void
}

export function makeEntryStructureConfig(
  config: Pick<StructureConfig, 'overrides' | 'types' | 'discoverLibraries'>,
  address: ChainSpecificAddress,
): StructureContractConfig {
  const override = StructureContract.parse(
    config.overrides?.[address.toString()] ?? {},
  )

  return {
    ...override,
    address,
    discoverLibraries:
      override.discoverLibraries ?? config.discoverLibraries ?? false,
    types: { ...config.types, ...override.types },
    pushValues: function (template: StructureContract) {
      const { address: _address, pushValues: _pushValues, ...current } = this
      Object.assign(this, mergeStructureContract(template, current))
    },
  }
}

export function mergeStructureContract(
  base: StructureContract,
  override: StructureContract,
): StructureContract {
  return mergeWithPolicy(structureContractPolicy, base, override)
}

export const structureFieldPolicy: MergePolicy<StructureContractField> = {
  handler: (base, override) => override ?? base,
  template: overrideScalar,
  copy: overrideScalar,
  edit: (base, override) => override ?? base,
}

export function assertHandlerOrCopy(field: StructureContractField): void {
  assert(
    field.handler === undefined || field.copy === undefined,
    'handler and copy cannot both be defined at the same time. They are mutually exclusive.',
  )
}

function mergeStructureField(
  base: StructureContractField,
  override: StructureContractField,
): StructureContractField {
  const merged = mergeWithPolicy(structureFieldPolicy, base, override)
  assertHandlerOrCopy(merged)
  return merged
}

const structureContractPolicy: MergePolicy<StructureContract> = {
  discoverLibraries: overrideScalar,
  canActIndependently: overrideScalar,
  ignoreDiscovery: overrideScalar,
  proxyType: overrideScalar,
  ignoreMethods: unionStrings,
  ignoreInWatchMode: unionStrings,
  ignoreRelatives: mergeIgnoreRelatives,
  fields: mergeRecordByName(mergeStructureField),
  methods: mergeRecordShallow,
  manualSourcePaths: mergeRecordShallow,
  types: mergeRecordShallow,
}
