import { EthereumAddress, ProxyDetails } from '@l2beat/shared-pure'
import { BigNumber } from 'ethers'

import { DiscoveryProvider } from '../../provider/DiscoveryProvider'
import { getCallResult } from '../../utils/getCallResult'

async function getProxyType(
  provider: DiscoveryProvider,
  address: EthereumAddress,
  blockNumber: number,
) {
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
) {
  const result = await getCallResult<string>(
    provider,
    address,
    'function implementation() public view returns (address codeAddr)',
    [],
    blockNumber,
  )
  return result && EthereumAddress(result)
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
