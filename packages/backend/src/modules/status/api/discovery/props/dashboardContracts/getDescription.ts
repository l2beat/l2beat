import { DiscoveryConfig } from '@l2beat/discovery'
import { EthereumAddress } from '@l2beat/shared-pure'

export function getDescription(
  config: DiscoveryConfig,
  address: EthereumAddress,
  field: string,
): string | undefined {
  return config.overrides.get(address).methods?.[field]
}
