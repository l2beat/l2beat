import type { ProxyDetails } from '@l2beat/discovery-types'
import type { EthereumAddress } from '@l2beat/shared-pure'

import { get$Implementations } from '@l2beat/discovery-types'
import type { IProvider } from '../../provider/IProvider'
import { detectPolygonProxy } from '../auto/PolygonProxy'

export async function getPolygonExtensionProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const detection = await detectPolygonProxy(provider, address)
  if (!detection || detection.type !== 'Polygon proxy') {
    return undefined
  }
  const extension = await provider.getStorageAsAddress(address, 37)

  return {
    type: 'Polygon Extension proxy',
    values: {
      $admin: detection.values.$admin,
      $implementation: get$Implementations(detection.values)
        .concat(extension)
        .map((i) => i.toString()),
    },
  }
}
