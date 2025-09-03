import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import merge from 'lodash/merge'
import { ConfigReader } from './ConfigReader'
import { getDiscoveryPaths } from './getDiscoveryPaths'
import { type StructureConfig, StructureContract } from './StructureConfig'

export function buildSharedModuleIndex(
  config: StructureConfig,
  configReader?: ConfigReader,
): Set<ChainSpecificAddress> {
  const result = new Set<ChainSpecificAddress>()
  configReader ??= new ConfigReader(getDiscoveryPaths().discovery)

  for (const sharedModule of config.sharedModules) {
    const discovery = configReader?.readDiscovery(sharedModule)
    for (const entry of discovery.entries) {
      result.add(entry.address)
    }
  }
  return result
}

export type StructureContractOverrides = StructureContract & {
  address: ChainSpecificAddress
}

export type StructureContractConfig = StructureContractOverrides & {
  pushValues: (arg: StructureContract) => void
}

export function makeEntryStructureConfig(
  config: Pick<StructureConfig, 'overrides' | 'types'>,
  address: ChainSpecificAddress,
): StructureContractConfig {
  const override =
    config.overrides?.[address.toString()] ?? StructureContract.parse({})

  const overrides = { address, ...override }

  const result = {
    ...overrides,
    types: merge({}, config.types ?? {}, overrides.types),
    pushValues: function (values: StructureContract) {
      const newState = {
        address: this.address,
        ...StructureContract.parse(merge({}, values, this)),
      }
      Object.assign(this, newState)
    },
  }
  return result
}
