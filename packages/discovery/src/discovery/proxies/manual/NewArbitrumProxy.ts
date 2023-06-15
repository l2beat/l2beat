import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getNewArbitrumProxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address, blockNumber)
  if (!detection || detection.upgradeability.type !== 'EIP1967 proxy') {
    return undefined
  }
  const [adminFacet, userFacet] = await Promise.all([
    getCallResult<EthereumAddress>(
      provider,
      address,
      'function getAdminFacet() view returns (address)',
      [],
      blockNumber,
    ),
    getCallResult<EthereumAddress>(
      provider,
      address,
      'function getUserFacet() view returns (address)',
      [],
      blockNumber,
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
