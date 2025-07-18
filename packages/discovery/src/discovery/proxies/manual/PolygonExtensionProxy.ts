import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { get$Implementations } from '../../utils/extractors'
import { detectPolygonProxy } from '../auto/PolygonProxy'
import type { ProxyDetails } from '../types'

export async function getPolygonExtensionProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
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
