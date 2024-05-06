import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'

// biome-ignore lint/suspicious/useAwait: this does not do anything, but just keep the interface the same
export async function getImmutableProxy(
  _provider: DiscoveryProvider,
  _address: EthereumAddress,
  _blockNumber: number,
): Promise<ProxyDetails | undefined> {
  return {
    upgradeability: {
      type: 'immutable',
    },
    implementations: [],
    relatives: [],
  }
}
