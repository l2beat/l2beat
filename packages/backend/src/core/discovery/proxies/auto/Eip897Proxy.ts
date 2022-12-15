import { EthereumAddress } from '@l2beat/types'
import { BigNumber } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'
import { ProxyDetection } from '../types'

async function getProxyType(
  provider: DiscoveryProvider,
  address: EthereumAddress,
) {
  const type = await getCallResult<BigNumber>(
    provider,
    address,
    'function proxyType() public pure returns (uint256 proxyTypeId)',
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
) {
  const result = await getCallResult<string>(
    provider,
    address,
    'function implementation() public view returns (address codeAddr)',
  )
  return result && EthereumAddress(result)
}

export async function detectEip897Proxy(
  provider: DiscoveryProvider,
  address: EthereumAddress,
): Promise<ProxyDetection | undefined> {
  const type = await getProxyType(provider, address)
  if (!type) {
    return
  }
  const implementation = await getImplementation(provider, address)
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
