import type { ContractConfig } from '../config/ContractConfig'
import type { DiscoveryCategory } from '../config/RawDiscoveryConfig'

export function resolveCategory(
  config: ContractConfig,
): DiscoveryCategory | undefined {
  if (config.category === undefined) {
    return undefined
  }

  const result = config.categories?.[config.category]
  if (result === undefined) {
    throw new Error(`Category ${config.category} not found in categories`)
  }

  return result
}
