import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider.js'
import { get$Implementations } from '../../utils/extractors.js'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy.js'
import type { ProxyDetails } from '../types.js'

export async function getZkSyncLiteProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectEip1967Proxy(provider, address)
  if (!detection || detection.type !== 'EIP1967 proxy') {
    return undefined
  }
  const additional = await provider.getStorageAsAddress(address, 19)
  return {
    type: 'zkSync Lite proxy',
    values: {
      $admin: detection.values.$admin,
      $implementation: get$Implementations(detection.values)
        .concat(additional)
        .map((i) => i.toString()),
    },
  }
}
