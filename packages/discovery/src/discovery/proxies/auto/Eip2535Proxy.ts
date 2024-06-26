// EIP-2535: Diamonds, Multi-Facet Proxy
// https://eips.ethereum.org/EIPS/eip-2535#a-note-on-implementing-interfaces
// every contract implementing this standard needs to have facetAddresses() view function

import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'

export async function detectEip2535proxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const facets = await provider.callMethod<EthereumAddress[]>(
    address,
    'function facetAddresses() external view returns (address[] memory facetAd)',
    [],
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
