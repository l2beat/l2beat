import { EthereumAddress } from '@l2beat/shared'
import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'

export function getDescription(
  field: string,
  address: EthereumAddress,
  config: DiscoveryConfig,
): string | undefined {
  return config.descriptions?.[address.toString()]?.methods?.[field]
}
