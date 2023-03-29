import { EthereumAddress } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/DiscoveryConfig'

export function getDescription(
  config: DiscoveryConfig,
  address: EthereumAddress,
  field: string,
): string | undefined {
  return config.descriptions?.[address.toString()]?.methods[field]
}
