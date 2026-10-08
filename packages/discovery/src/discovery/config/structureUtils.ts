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
  HANDLER_AND_COPY_EXCLUSIVE_MESSAGE,
  handlerAndCopyAreExclusive,
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

  const projectDiscoverLibraries = config.discoverLibraries ?? false

  return {
    ...override,
    address,
    discoverLibraries: override.discoverLibraries ?? projectDiscoverLibraries,
    types: { ...config.types, ...override.types },
    pushValues: function (template: StructureContract) {
      const { address: _address, pushValues: _pushValues, ...current } = this
      const merged = mergeStructureContract(template, {
        ...current,
        discoverLibraries: override.discoverLibraries,
      })
      Object.assign(this, merged, {
        discoverLibraries: merged.discoverLibraries ?? projectDiscoverLibraries,
      })
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

export function mergeFieldWithPolicy<F extends StructureContractField>(
  policy: MergePolicy<F>,
  base: F,
  override: F,
): F {
  const merged = mergeWithPolicy(
    policy,
    dropValueSourceReplacedBy(base, override),
    override,
  )
  assert(handlerAndCopyAreExclusive(merged), HANDLER_AND_COPY_EXCLUSIVE_MESSAGE)
  return merged
}

function dropValueSourceReplacedBy<F extends StructureContractField>(
  base: F,
  override: F,
): F {
  if (override.handler !== undefined) {
    return { ...base, copy: undefined }
  }
  if (override.copy !== undefined) {
    return { ...base, handler: undefined }
  }
  return base
}

function mergeStructureField(
  base: StructureContractField,
  override: StructureContractField,
): StructureContractField {
  return mergeFieldWithPolicy(structureFieldPolicy, base, override)
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
