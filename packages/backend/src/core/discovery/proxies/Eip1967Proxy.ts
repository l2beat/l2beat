import { constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from '../utils/address'
import { getStorage } from '../utils/getStorage'
import { extendDetect } from './extendDetect'
import { ProxyDetection } from './types'

// keccak256('eip1967.proxy.implementation') - 1)
const IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, IMPLEMENTATION_SLOT, blockNumber),
  )
}

// keccak256('eip1967.proxy.admin') - 1)
const ADMIN_SLOT =
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'

async function getAdmin(
  provider: providers.Provider,
  contract: Contract | string,
  blockNumber: number,
) {
  return bytes32ToAddress(
    await getStorage(provider, contract, ADMIN_SLOT, blockNumber),
  )
}

async function detect(
  provider: providers.Provider,
  address: string,
  blockNumber: number,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address, blockNumber)
  if (implementation === constants.AddressZero) {
    return
  }
  const admin = await getAdmin(provider, address, blockNumber)
  return {
    implementations: [implementation],
    relatives: [admin],
    upgradeability: {
      type: 'EIP1967 proxy',
      implementation,
      admin,
    },
  }
}

export const Eip1967Proxy = {
  getImplementation,
  getAdmin,
  ...extendDetect(detect),
}
