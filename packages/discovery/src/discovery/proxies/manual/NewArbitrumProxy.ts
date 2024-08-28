import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { get$Implementations } from '@l2beat/discovery-types'
import { IProvider } from '../../provider/IProvider'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'

export async function getNewArbitrumProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.type !== 'EIP1967 proxy') {
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
    type: 'new Arbitrum proxy',
    values: {
      $admin: detection.values.$admin,
      $implementation: get$Implementations(detection.values)
        .concat(adminFacet, userFacet)
        .map((i) => i.toString()),
    },
  }
}
