import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import merge from 'lodash/merge'
import mergeWith from 'lodash/mergeWith'
import { type StructureConfig, StructureContract } from './StructureConfig'

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
      const merged = StructureContract.parse(
        mergeWith({}, values, this, replaceHandler),
      )
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

function replaceHandler(_: unknown, override: unknown, key: string) {
  if (key === 'handler') {
    return override
  }
  return undefined
}
