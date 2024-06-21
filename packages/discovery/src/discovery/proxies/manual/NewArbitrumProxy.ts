import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getNewArbitrumProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }
  const [adminFacet, userFacet] = await Promise.all([
    provider.callMethod<EthereumAddress>(
      address,
      'function getAdminFacet() view returns (address)',
      [],
    ),
    provider.callMethod<EthereumAddress>(
      address,
      'function getUserFacet() view returns (address)',
      [],
    ),
  ])
  if (!adminFacet || !userFacet) {
    return undefined
  }
  return {
    implementations: [...detection.implementations, adminFacet, userFacet],
    relatives: [detection.upgradeability.admin],
    upgradeability: {
      type: 'new Arbitrum proxy',
      admin: detection.upgradeability.admin,
      implementation: detection.upgradeability.implementation,
      userImplementation: userFacet,
      adminImplementation: adminFacet,
    },
  }
}
