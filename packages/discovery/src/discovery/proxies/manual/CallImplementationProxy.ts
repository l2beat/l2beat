import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

export async function getCallImplementationProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const implementation = await getCallResult<EthereumAddress>(
    provider,
    address,
    'function implementation() view returns (address)',
    [],
    blockNumber,
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
