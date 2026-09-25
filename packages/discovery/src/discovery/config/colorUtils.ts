import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  type ColorConfig,
  ColorContract,
  type ColorContractField,
} from './ColorConfig'
import {
  type MergePolicy,
  mergeRecordByName,
  mergeRecordShallow,
  mergeWithPolicy,
  overrideScalar,
  replaceArray,
} from './mergeUtils'

export type ColorContractOverrides = ColorContract & {
  name?: string
}

export function makeEntryColorConfig(
  config: ColorConfig,
  address: ChainSpecificAddress,
  template: ColorContract,
): ColorContractOverrides {
  const projectLayer = ColorContract.parse({ categories: config.categories })
  const override =
    config.overrides?.[address.toString()] ?? ColorContract.parse({})

  const merged = mergeColorContract(
    mergeColorContract(template, projectLayer),
    override,
  )
  return { ...merged, name: config.names?.[address.toString()] }
}

export function mergeColorContract(
  base: ColorContract,
  override: ColorContract,
): ColorContract {
  return mergeWithPolicy(colorContractPolicy, base, override)
}

export const colorFieldPolicy: MergePolicy<ColorContractField> = {
  description: overrideScalar,
  severity: overrideScalar,
  type: (base, override) => override ?? base,
}

const colorContractPolicy: MergePolicy<ColorContract> = {
  displayName: overrideScalar,
  category: overrideScalar,
  description: overrideScalar,
  critical: (base, override) => override ?? base,
  references: replaceArray,
  categories: mergeRecordShallow,
  manualSourcePaths: mergeRecordShallow,
  fields: mergeRecordByName<ColorContractField>((base, override) =>
    mergeWithPolicy(colorFieldPolicy, base, override),
  ),
}
