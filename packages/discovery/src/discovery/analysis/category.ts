import type { DiscoveryCategory } from '../config/ColorConfig'
import type { ContractConfigColor } from '../config/ContractConfig'

export function resolveCategory(
  config: ContractConfigColor,
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
