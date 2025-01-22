import type { EthereumAddress } from '@l2beat/shared-pure'
import type { DiscoveryConfig } from '../config/DiscoveryConfig'

export function shouldSkip(
  address: EthereumAddress,
  config: DiscoveryConfig,
  depth: number,
  counter: number,
): string | undefined {
  if (config.for(address).ignoreDiscovery) {
    return 'ignored'
  }

  if (config.isInSharedModules(address)) {
    return 'part of a shared module'
  }

  if (depth > config.maxDepth) {
    return `depth ${depth} > MAX (${config.maxDepth})`
  }

  if (counter > config.maxAddresses) {
    return `total ${counter} > MAX (${config.maxAddresses})`
  }
}
