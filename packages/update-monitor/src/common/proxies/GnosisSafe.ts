import { providers } from 'ethers'

import { GnosisSafe__factory } from '../../typechain'
import { ContractParameters } from '../../types'
import { getCallResult } from '../getCallResult'
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
  return getCallResult<string>(
    provider,
    address,
    'function masterCopy() view returns(address)',
  )
}

export const GnosisSafe = {
  getContract,
  getMasterCopy,
  detect,
}
