import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getZkSyncLiteProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }
  const additional = await provider.getStorageAsAddress(address, 19)
  return {
    implementations: [...detection.implementations, additional],
    relatives: [detection.upgradeability.admin],
    upgradeability: {
      type: 'zkSync Lite proxy',
      admin: detection.upgradeability.admin,
      implementation: detection.upgradeability.implementation,
      additional,
    },
  }
}
