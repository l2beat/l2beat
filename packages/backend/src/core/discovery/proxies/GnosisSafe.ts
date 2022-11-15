import { BigNumber, Contract, providers, utils } from 'ethers'

import { ContractParameters } from '../types'
import { bytes32ToAddress } from '../utils/address'
import { getCallResult } from '../utils/getCallResult'
import { getStorage } from '../utils/getStorage'
import { ProxyDetection } from './types'

const abi = new utils.Interface([
  'function getOwners() public view returns (address[])',
  'function getThreshold() public view returns (uint256)',
])

async function getContract(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  const contract = new Contract(address, abi, provider)

  return {
    name,
    address,
    upgradeability: {
      type: 'gnosis safe',
    },
    values: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      owners: (await contract.getOwners()) as string[],
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      threshold: ((await contract.getThreshold()) as BigNumber).toNumber(),
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
