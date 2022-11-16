import { assert } from '@l2beat/common'
import { BigNumber, providers } from 'ethers'

import { ContractParameters } from '../types'
import { bytes32ToAddress } from '../utils/address'
import { getCallResult } from '../utils/getCallResult'
import { getStorage } from '../utils/getStorage'
import { ProxyDetection } from './types'

async function getContract(
  provider: providers.JsonRpcProvider,
  address: string,
  name: string,
  blockNumber: number,
): Promise<ContractParameters> {
  const owners = await getCallResult<string[]>(
    provider,
    address,
    'function getOwners() view returns (address[])',
    blockNumber,
  )

  const threshold = await getCallResult<BigNumber>(
    provider,
    address,
    'function getThreshold() view returns (uint256)',
    blockNumber,
  )

  assert(owners !== undefined)
  assert(threshold !== undefined)

  return {
    name,
    address,
    upgradeability: {
      type: 'gnosis safe',
    },
    values: {
      owners,
      threshold: threshold.toNumber(),
    },
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
  blockNumber: number,
): Promise<ProxyDetection | undefined> {
  const masterCopy = await getMasterCopy(provider, address, blockNumber)
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

async function getMasterCopy(
  provider: providers.Provider,
  address: string,
  blockNumber: number,
) {
  const [callResult, slot0] = await Promise.all([
    getCallResult<string>(
      provider,
      address,
      'function masterCopy() view returns(address)',
      blockNumber,
    ),
    getStorage(provider, address, 0, blockNumber),
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
