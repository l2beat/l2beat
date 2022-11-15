import { BigNumber, Contract, providers } from 'ethers'

import { getCallResult } from '../utils/getCallResult'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

async function getProxyType(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const type = await getCallResult<BigNumber>(
    provider,
    contract,
    'function proxyType() public pure returns (uint256 proxyTypeId)',
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
) {
  return getCallResult<string>(
    provider,
    contract,
    'function implementation() public view returns (address codeAddr)',
  )
}

async function detect(
  provider: providers.Provider,
  address: string,
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

export const Eip897Proxy = {
  getProxyType,
  getImplementation,
  ...extendDetect(detect),
}
