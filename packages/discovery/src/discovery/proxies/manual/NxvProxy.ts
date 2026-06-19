import { ChainSpecificAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

// NXVProxy is a fork of the Gnosis Safe proxy: the singleton (implementation)
// is stored at slot 0 and exposed via masterCopy(). We read slot 0 directly,
// which is exactly what masterCopy() returns, without the Safe-specific
// owners/modules/threshold assertions that detectGnosisSafe makes.
export async function getNxvProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const singleton = await provider.getStorageAsAddress(address, 0)
  if (singleton === ChainSpecificAddress.ZERO(provider.chain)) {
    return undefined
  }
  return {
    type: 'NXV proxy',
    values: {
      $immutable: false,
      $implementation: singleton.toString(),
    },
  }
}
