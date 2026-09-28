import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import merge from 'lodash/merge'
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
  const discoverLibraries =
    override.discoverLibraries ?? config.discoverLibraries ?? false

  const overrides = { address, ...override, discoverLibraries }

  const result = {
    ...overrides,
    types: merge({}, config.types ?? {}, overrides.types),
    pushValues: function (values: StructureContract) {
      // `ignoreRelatives: true` is a wildcard (ignore every relative). lodash
      // `merge` collapses it to `[]` whenever the other side carries the
      // schema's default empty array, silently dropping a template's wildcard.
      // Preserve it explicitly: the wildcard subsumes any field list on either
      // side.
      const ignoreAllRelatives =
        values.ignoreRelatives === true || this.ignoreRelatives === true
      const merged = StructureContract.parse({
        ...merge({}, values, this),
        fields: mergeFields(values.fields, this.fields),
      })
      if (ignoreAllRelatives) {
        merged.ignoreRelatives = true
      }
      const newState = { address: this.address, ...merged }
      newState.discoverLibraries ??=
        this.discoverLibraries ?? config.discoverLibraries ?? false
      Object.assign(this, newState)
    },
  }
  return result
}

function mergeFields(
  templateFields: Record<string, StructureContractField>,
  overrideFields: Record<string, StructureContractField>,
): Record<string, StructureContractField> {
  const names = new Set([
    ...Object.keys(templateFields),
    ...Object.keys(overrideFields),
  ])
  const result: Record<string, StructureContractField> = {}
  for (const name of names) {
    const overrideField = overrideFields[name]
    const field = merge({}, templateFields[name], overrideField)
    if (overrideField?.handler !== undefined) {
      field.handler = overrideField.handler
    }
    result[name] = field
  }
  return result
}
