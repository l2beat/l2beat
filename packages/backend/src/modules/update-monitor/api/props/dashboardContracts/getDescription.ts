import type { DiscoveryConfig } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export function getDescription(
  config: DiscoveryConfig,
  address: EthereumAddress,
  field: string,
): string | undefined {
  return config.for(address).methods[field]
}
