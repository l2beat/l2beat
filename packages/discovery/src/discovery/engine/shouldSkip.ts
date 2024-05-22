import { EthereumAddress } from '@l2beat/shared-pure'
import { DiscoveryConfig } from '../config/DiscoveryConfig'

export function shouldSkip(
  address: EthereumAddress,
  config: DiscoveryConfig,
  depth: number,
  counter: number,
): string | undefined {
  if (config.overrides.get(address).ignoreDiscovery) {
    return 'Address ignored'
  }

  if (config.isInSharedModules(address)) {
    return 'Part of a shared module'
  }

  if (depth > config.maxDepth) {
    return `Error: Depth ${depth} exceeded max = ${config.maxDepth}`
  }

  if (counter > config.maxAddresses) {
    return `Error: Total addresses ${counter} exceeded max = ${config.maxAddresses}`
  }
}
