import { ProxyDetails } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { IProvider } from '../../provider/IProvider'
import { detectEip1967Proxy } from '../auto/Eip1967Proxy'
import { get$Implementations } from '@l2beat/discovery-types'

export async function getZkSyncLiteProxy(
  provider: IProvider,
  address: EthereumAddress,
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
      $implementation: get$Implementations(detection.values).concat(additional),
    },
  }
}
