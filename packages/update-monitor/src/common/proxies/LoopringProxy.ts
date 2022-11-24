//Loopring Proxy is an  EIP-897 proxy but without getProxyType method and with proxyOwner() method

import { Contract, providers } from 'ethers'

import { getCallResult } from '../getCallResult'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

async function getProxyType(
  provider: providers.Provider,
  contract: Contract | string,
) {
  return 2 //upgradable Proxy
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

export const LoopringProxy = {
  getProxyType,
  getImplementation,
  ...extendDetect(detect),
}
