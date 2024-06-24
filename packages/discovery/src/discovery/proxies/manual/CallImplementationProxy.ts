import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'

export async function getCallImplementationProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    'function implementation() view returns (address)',
    [],
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
