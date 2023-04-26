import { DiscoveryConfig } from '../config/DiscoveryConfig'
import { DiscoveryStackItem } from './DiscoveryStack'

export function shouldSkip(item: DiscoveryStackItem, config: DiscoveryConfig) {
  if (config.overrides.get(item.address).ignoreDiscovery) {
    return 'Address ignored'
  }

  if (config.getSharedModule(item.address)) {
    return 'Part of a shared module'
  }

  if (item.depth > config.maxDepth) {
    return `Error: Depth ${item.depth} exceeded max = ${config.maxDepth}`
  }

  if (item.counter > config.maxAddresses) {
    return `Error: Total addresses ${item.counter} exceeded max = ${config.maxAddresses}`
  }
}
