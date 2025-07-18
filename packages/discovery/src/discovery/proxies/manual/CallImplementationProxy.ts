import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

export async function getCallImplementationProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
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
      $implementation: ChainSpecificAddress.fromLong(
        provider.chain,
        implementation,
      ).toString(),
    },
  }
}
