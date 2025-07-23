import { ChainSpecificAddress, type EthereumAddress } from '@l2beat/shared-pure'
import type { BigNumber } from 'ethers'
import type { IProvider } from '../../provider/IProvider'
import type { ProxyDetails } from '../types'

async function getProxyType(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<1 | 2 | undefined> {
  const type = await provider.callMethod<BigNumber>(
    address,
    'function proxyType() public pure returns (uint256 proxyTypeId)',
    [],
  )
  if (type?.eq(1)) {
    return 1
  }
  if (type?.eq(2)) {
    return 2
  }
}

async function getImplementation(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ChainSpecificAddress | undefined> {
  const result = await provider.callMethod<EthereumAddress>(
    address,
    'function implementation() public view returns (address codeAddr)',
    [],
  )
  if (result === undefined) {
    return
  }

  return ChainSpecificAddress.fromLong(provider.chain, result)
}

export async function detectEip897Proxy(
  provider: IProvider,
  address: ChainSpecificAddress,
): Promise<ProxyDetails | undefined> {
  const type = await getProxyType(provider, address)
  if (!type) {
    return
  }
  const implementation = await getImplementation(provider, address)
  if (!implementation) {
    return
  }
  return {
    type: 'EIP897 proxy',
    values: {
      $immutable: type !== 2,
      $implementation: implementation.toString(),
    },
  }
}
