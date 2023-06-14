import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { bytes32ToAddress } from '../../utils/address'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getZkSyncLiteProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address, blockNumber)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }
  const additional = bytes32ToAddress(
    await provider.getStorage(address, 19, blockNumber),
  )
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
