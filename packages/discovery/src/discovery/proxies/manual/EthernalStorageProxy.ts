import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

export async function getEternalStorageProxy(
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
  const admin = await getCallResult<EthereumAddress>(
    provider,
    address,
    'function upgradeabilityOwner() view returns (address)',
    [],
    blockNumber,
  )
  if (!implementation || !admin) {
    return undefined
  }
  return {
    implementations: [implementation],
    relatives: [admin],
    upgradeability: {
      type: 'Eternal Storage proxy',
      admin,
      implementation: implementation,
    },
  }
}
