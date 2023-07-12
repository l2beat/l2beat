import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { detectPolygonProxy } from '../auto/PolygonProxy'

export async function getPolygonExtensionProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const detection = await detectPolygonProxy(provider, address, blockNumber)
  if (!detection || detection.upgradeability.type !== 'Polygon proxy') {
    return undefined
  }
  console.log('PolygonExtensionProxy', address)
  const extension = bytes32ToAddress(
    await provider.getStorage(address, 37, blockNumber),
  )
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
