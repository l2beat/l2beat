import { EthereumAddress } from '@l2beat/types'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'
import { ProxyDetection } from '../types'

export async function detectEip2535proxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const facets = await getCallResult<EthereumAddress[]>(
    provider,
    address,
    'function facetAddresses() external view returns (address[] memory facetAd)',
  )

  return {
    implementations: facets ?? [],
    relatives: [],
    upgradeability: {
      type: 'EIP2535 proxy diamond',
      facets: facets ?? [],
    },
  }
}
