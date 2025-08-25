import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { StructureConfig } from '../config/StructureConfig'
import { makeEntryStructureConfig } from '../config/structureUtils'

export function shouldSkip(
  address: ChainSpecificAddress,
  config: StructureConfig,
  sharedModuleIndex: Set<ChainSpecificAddress>,
  depth: number,
  counter: number,
): string | undefined {
  if (makeEntryStructureConfig(config, address).ignoreDiscovery) {
    return 'ignored'
  }

  if (sharedModuleIndex.has(address)) {
    return 'part of a shared module'
  }

  if (depth > config.maxDepth) {
    return `depth ${depth} > MAX (${config.maxDepth})`
  }

  if (counter > config.maxAddresses) {
    return `total ${counter} > MAX (${config.maxAddresses})`
  }
}
