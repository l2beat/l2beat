import { EthereumAddress } from '@l2beat/shared'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'
import { ProxyDetection } from '../types'

export async function getCallImplementationProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
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
