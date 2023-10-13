import { ProxyDetails } from '@l2beat/discovery-types'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'

// eslint-disable-next-line
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
