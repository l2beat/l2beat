import { providers } from 'ethers'

import { PolyWrapper__factory } from '../../../typechain'
import { ContractParameters } from '../../../types'
import { addresses } from '../constants'

export async function getPolyWrapper(
  provider: providers.JsonRpcProvider,
): Promise<ContractParameters> {
  const polyWrapper = PolyWrapper__factory.connect(addresses.bridge, provider)

  return {
    name: 'PolyWrapper',
    address: addresses.bridge,
    upgradeability: {
      type: 'immutable',
    },
    values: {
      chainId: (await polyWrapper.chainId()).toNumber(),
      feeCollector: await polyWrapper.feeCollector(),
      isOwner: await polyWrapper.isOwner(),
      maxLockProxyIndex: (await polyWrapper.maxLockProxyIndex()).toNumber(),
      owner: await polyWrapper.owner(),
      paused: await polyWrapper.paused(),
      lockProxies: await getLockProxies(provider),
    },
  }
}

export async function getLockProxies(
  provider: providers.Provider,
): Promise<string[]> {
  const polyWrapper = PolyWrapper__factory.connect(addresses.bridge, provider)
  const maxLockProxyIndex = (await polyWrapper.maxLockProxyIndex()).toNumber()
  const result: string[] = []
  for (let i = 0; i < maxLockProxyIndex; i++) {
    const lockProxy = await polyWrapper.lockProxyIndexMap(i)
    result.push(lockProxy)
  }
  return result
}
