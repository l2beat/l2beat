import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { detectPolygonProxy } from '../auto/PolygonProxy'

export async function getPolygonExtensionProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectPolygonProxy(provider, address)
  if (!detection || detection.upgradeability.type !== 'Polygon proxy') {
    return undefined
  }
  // TODO: (sz-piotr) console.log, really!?
  console.log('PolygonExtensionProxy', address)
  const extension = await provider.getStorageAsAddress(address, 37)
  // TODO: (sz-piotr) console.log, really!?
  console.log('Extension', extension)
  return {
    implementations: [...detection.implementations, extension],
    relatives: [detection.upgradeability.admin],
    upgradeability: {
      type: 'Polygon Extension proxy',
      admin: detection.upgradeability.admin,
      implementation: detection.upgradeability.implementation,
      extension,
    },
  }
}
