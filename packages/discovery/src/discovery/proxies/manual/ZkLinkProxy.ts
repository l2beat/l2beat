import {
  assert,
  ChainSpecificAddress,
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { get$Implementations } from '../../utils/extractors'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'
import type { ProxyDetails } from '../types'

export async function getZkLinkProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.type !== 'EIP1967 proxy') {
    return undefined
  }

  const periphery = await provider.callMethod<EthereumAddress>(
    address,
    'function periphery() view returns (address)',
    [],
  )
  assert(periphery !== undefined, 'ZkLink proxy: missing periphery')

  return {
    type: 'ZkLink proxy',
    values: {
      $admin: detection.values.$admin,
      $implementation: get$Implementations(detection.values)
        .concat(ChainSpecificAddress.fromLong(provider.chain, periphery))
        .map((i) => i.toString()),
    },
  }
}
