import { providers } from 'ethers'

import { GnosisSafe__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { bytes32ToAddress } from '../address'
import { getCallResult } from '../getCallResult'
import { getStorage } from '../getStorage'
import { ProxyDetection } from './types'

async function getContract(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const GnosisSafe = GnosisSafe__factory.connect(address, provider)

  return {
    name,
    address: GnosisSafe.address,
    upgradeability: {
      type: 'gnosis safe',
    },
    values: {
      owners: await GnosisSafe.getOwners(),
      threshold: (await GnosisSafe.getThreshold()).toNumber(),
    },
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const masterCopy = await getMasterCopy(provider, address)
  if (!masterCopy) {
    return
  }
  return {
    implementations: [masterCopy],
    relatives: [],
    upgradeability: {
      type: 'gnosis safe',
    },
  }
}

async function getMasterCopy(provider: providers.Provider, address: string) {
  const [callResult, slot0] = await Promise.all([
    getCallResult<string>(
      provider,
      address,
      'function masterCopy() view returns(address)',
    ),
    getStorage(provider, address, 0),
  ])
  const slot0Address = bytes32ToAddress(slot0)
  if (callResult === slot0Address) {
    return callResult
  }
}

export const GnosisSafe = {
  getContract,
  getMasterCopy,
  detect,
}
