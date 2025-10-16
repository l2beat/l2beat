import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { get$Admins, get$Implementations } from '../../utils/extractors'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'
import type { ProxyDetails } from '../types'

export async function getZkLighterProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.type !== 'EIP1967 proxy') {
    return undefined
  }
  const additional = await provider.getStorageAsAddress(address, 7)

  return {
    type: 'zkLighter proxy',
    values: {
      $admin: get$Admins(detection.values),
      $implementation: get$Implementations(detection.values)
        .concat(additional)
        .map((i) => i.toString()),
    },
  }
}
