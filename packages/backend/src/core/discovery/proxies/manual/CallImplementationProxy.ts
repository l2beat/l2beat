import { EthereumAddress, ProxyDetails } from '@l2beat/shared'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

export async function getCallImplementationProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await getCallResult<EthereumAddress>(
    provider,
    address,
    'function implementation() view returns (address)',
  )
  if (!implementation) {
    return undefined
  }
  return {
    implementations: [implementation],
    relatives: [],
    upgradeability: {
      type: 'call implementation proxy',
      implementation,
    },
  }
}
