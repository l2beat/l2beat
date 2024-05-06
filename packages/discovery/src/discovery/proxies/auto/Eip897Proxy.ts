import { ProxyDetails } from '@l2beat/discovery-types'
import { BigNumber } from 'ethers'

import { EthereumAddress } from '../../../utils/EthereumAddress'
import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

async function getProxyType(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<1 | 2 | undefined> {
  const type = await getCallResult<BigNumber>(
    provider,
    address,
    'function proxyType() public pure returns (uint256 proxyTypeId)',
    [],
    blockNumber,
  )
  if (type?.eq(1)) {
    return 1
  } else if (type?.eq(2)) {
    return 2
  }
}

async function getImplementation(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<EthereumAddress | undefined> {
  const result = await getCallResult<string>(
    provider,
    address,
    'function implementation() public view returns (address codeAddr)',
    [],
    blockNumber,
  )

  if (!result) {
    return
  }

  return EthereumAddress(result)
}

export async function detectEip897Proxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
): Promise<ProxyDetails | undefined> {
  const type = await getProxyType(provider, address, blockNumber)
  if (!type) {
    return
  }
  const implementation = await getImplementation(provider, address, blockNumber)
  if (!implementation) {
    return
  }
  return {
    implementations: [implementation],
    relatives: [],
    upgradeability: {
      type: 'EIP897 proxy',
      isUpgradable: type === 2,
      implementation,
    },
  }
}
