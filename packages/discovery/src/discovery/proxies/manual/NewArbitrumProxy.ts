import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { get$Implementations } from '../../utils/extractors'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'
import type { ProxyDetails } from '../types'

export async function getNewArbitrumProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
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
        .concat(
          ChainSpecificAddress.fromLong(provider.chain, adminFacet),
          ChainSpecificAddress.fromLong(provider.chain, userFacet),
        )
        .map((i) => i.toString()),
    },
  }
}
