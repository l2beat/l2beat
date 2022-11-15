import { BigNumber, Contract, providers } from 'ethers'

import { getCallResult } from '../utils/getCallResult'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

async function getProxyType(
  provider: providers.Provider,
  contract: Contract | string,
  blockNumber: number,
) {
  const type = await getCallResult<BigNumber>(
    provider,
    contract,
    'function proxyType() public pure returns (uint256 proxyTypeId)',
    blockNumber,
  )
  if (type?.eq(1)) {
    return 1
  } else if (type?.eq(2)) {
    return 2
  }
}

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
  blockNumber: number,
) {
  return getCallResult<string>(
    provider,
    contract,
    'function implementation() public view returns (address codeAddr)',
    blockNumber,
  )
}

async function detect(
  provider: providers.Provider,
  address: string,
  blockNumber: number,
): Promise<ProxyDetection | undefined> {
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

export const Eip897Proxy = {
  getProxyType,
  getImplementation,
  ...extendDetect(detect),
}
