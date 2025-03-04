import type { EthereumAddress } from '@l2beat/shared-pure'
import type { ProxyDetails } from '../types'

import type { IProvider } from '../../provider/IProvider'

export async function getCallImplementationProxy(
  provider: IProvider,
  address: EthereumAddress,
): Promise<ProxyDetails | undefined> {
  const implementation = await provider.callMethod<EthereumAddress>(
    address,
    'function implementation() view returns (address)',
    [],
  )
  if (!implementation) {
    return undefined
  }
  return {
    type: 'call implementation proxy',
    values: {
      $implementation: implementation.toString(),
    },
  }
}
