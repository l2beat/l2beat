import { EthereumAddress } from '@l2beat/shared'

import { DiscoveryConfig } from '../../../../../../core/discovery/config/DiscoveryConfig'

export function getDescription(
  config: DiscoveryConfig,
  address: EthereumAddress,
  field: string,
): string | undefined {
  return config.overrides.get(address)?.methods?.[field]
}
