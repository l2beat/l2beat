import type { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import { get$Implementations } from '../../utils/extractors'
import type { ProxyDetails } from '../types'
import { getUpgradeGatekeeperProxy } from './UpgradeGatekeeperProxy'

export async function getZkLighterProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const managed = await getUpgradeGatekeeperProxy(provider, address)
  if (managed === undefined) {
    return undefined
  }
  const additional = await provider.getStorageAsAddress(address, 7)

  return {
    type: 'zkLighter proxy',
    values: {
      ...managed.values,
      $implementation: get$Implementations(managed.values)
        .concat(additional)
        .map((i) => i.toString()),
    },
  }
}
