// EIP-2535: Diamonds, Multi-Facet Proxy
// https://eips.ethereum.org/EIPS/eip-2535#a-note-on-implementing-interfaces
// every contract implementing this standard needs to have facetAddresses() view function

import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

export async function detectEip2535proxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const facets = await getCallResult<EthereumAddress[]>(
    provider,
    address,
    'function facetAddresses() external view returns (address[] memory facetAd)',
    [],
    blockNumber,
  )

  if (facets === undefined) {
    return
  }

  return {
    implementations: facets,
    relatives: [],
    upgradeability: {
      type: 'EIP2535 diamond proxy',
      facets: facets,
    },
  }
}
