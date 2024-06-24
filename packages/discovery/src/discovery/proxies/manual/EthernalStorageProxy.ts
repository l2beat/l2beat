import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'

export async function getEternalStorageProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    'function implementation() view returns (address)',
    [],
  )
  const admin = await provider.callMethod<EthereumAddress>(
    address,
    'function upgradeabilityOwner() view returns (address)',
    [],
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
