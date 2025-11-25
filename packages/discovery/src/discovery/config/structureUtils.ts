import type { ChainSpecificAddress } from '@l2beat/shared-pure'
// biome-ignore lint/style/noRestrictedImports: esm
import { merge } from 'lodash'
import type { Analysis } from '../analysis/AddressAnalyzer.js'
import { ConfigReader } from './ConfigReader.js'
import { getDiscoveryPaths } from './getDiscoveryPaths.js'
import { type StructureConfig, StructureContract } from './StructureConfig.js'

export interface SharedModuleIndexEntry {
  name?: string
  address: ChainSpecificAddress
  project: string
  type: Analysis['type']
}

export function buildSharedModuleIndex(
  config: StructureConfig,
  configReader?: ConfigReader,
): Record<ChainSpecificAddress, SharedModuleIndexEntry> {
  const result: Record<ChainSpecificAddress, SharedModuleIndexEntry> = {}
  configReader ??= new ConfigReader(getDiscoveryPaths().discovery)

  for (const sharedModule of config.sharedModules) {
    const discovery = configReader?.readDiscovery(sharedModule)
    for (const entry of discovery.entries) {
      result[entry.address] = {
        name: entry.name,
        address: entry.address,
        project: sharedModule,
        type: entry.type,
      }
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
      const newState = {
        address: this.address,
        ...StructureContract.parse(merge({}, values, this)),
      }
      newState.discoverLibraries ??=
        this.discoverLibraries ?? config.discoverLibraries ?? false
      Object.assign(this, newState)
    },
  }
  return result
}
