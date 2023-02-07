import { EthereumAddress } from '@l2beat/shared'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'
import { ProxyDetection } from '../types'

export async function getNewArbitrumProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }
  const [adminFacet, userFacet] = await Promise.all([
    getCallResult<EthereumAddress>(
      provider,
      address,
      'function getAdminFacet() view returns (address)',
      [],
    ),
    getCallResult<EthereumAddress>(
      provider,
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
    relatives: [],
    upgradeability: {
      type: 'new Arbitrum proxy',
      admin: detection.upgradeability.admin,
      implementation: detection.upgradeability.implementation,
      userImplementation: userFacet,
      adminImplementation: adminFacet,
    },
  }
}
