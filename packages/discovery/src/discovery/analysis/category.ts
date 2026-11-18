import type { ColorContract, DiscoveryCategory } from '../config/ColorConfig'

export function resolveCategory(
  config: ColorContract,
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
