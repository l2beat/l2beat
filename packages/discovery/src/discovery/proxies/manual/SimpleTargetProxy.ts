import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

export async function getSimpleTargetProxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const [owner, target] = await Promise.all([
    provider.callMethod<EthereumAddress>(
      address,
      'function owner() view returns (address)',
      [],
    ),
    provider.callMethod<EthereumAddress>(
      address,
      'function target() view returns (address)',
      [],
    ),
  ])

  if (!target || !owner) {
    return undefined
  }

  const implementation = ChainSpecificAddress.fromLong(provider.chain, target)
  if (implementation === ChainSpecificAddress.ZERO(provider.chain)) {
    return undefined
  }

  const admin = ChainSpecificAddress.fromLong(provider.chain, owner)

  return {
    type: 'simple target proxy',
    values: {
      $admin: admin.toString(),
      $implementation: implementation.toString(),
    },
  }
}
