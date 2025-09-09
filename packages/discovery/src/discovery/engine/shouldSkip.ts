import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { StructureConfig } from '../config/StructureConfig'
import {
  makeEntryStructureConfig,
  type SharedModuleIndexEntry,
} from '../config/structureUtils'

export function shouldSkip(
  address: ChainSpecificAddress,
  config: StructureConfig,
  sharedModuleIndex: Record<ChainSpecificAddress, SharedModuleIndexEntry>,
  depth: number,
  counter: number,
): string | undefined {
  if (makeEntryStructureConfig(config, address).ignoreDiscovery) {
    return 'ignored'
  }

  if (address in sharedModuleIndex) {
    return 'part of a shared module'
  }

  if (depth > config.maxDepth) {
    return `depth ${depth} > MAX (${config.maxDepth})`
  }

  if (counter > config.maxAddresses) {
    return `total ${counter} > MAX (${config.maxAddresses})`
  }
}
