import { constants, Contract, providers } from 'ethers'

import { ContractParameters, ProxyDetection } from '../../types'
import { bytes32ToAddress } from '../address'

// keccak256('eip1967.proxy.implementation') - 1)
const EIP1967_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

async function getImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    EIP1967_IMPLEMENTATION_SLOT,
  )
  return bytes32ToAddress(value)
}

// keccak256('eip1967.proxy.admin') - 1)
const EIP1967_ADMIN_SLOT =
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'

async function getAdmin(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(address, EIP1967_ADMIN_SLOT)
  return bytes32ToAddress(value)
}

async function getSimpleContract(
  provider: providers.Provider,
  address: string,
  name: string,
): Promise<ContractParameters> {
  return {
    name,
    address,
    upgradeability: {
      type: 'eip1967 proxy',
      implementation: await getImplementation(provider, address),
      admin: await getAdmin(provider, address),
    },
  }
}

async function detect(
  provider: providers.Provider,
  address: string,
): Promise<ProxyDetection | undefined> {
  const implementation = await getImplementation(provider, address)
  if (implementation === constants.AddressZero) {
    return
  }
  const admin = await getAdmin(provider, address)
  return {
    implementations: [implementation],
    relatives: [admin],
    upgradeability: {
      type: 'eip1967 proxy',
      implementation,
      admin,
    },
  }
}

export const Eip1967Proxy = {
  getImplementation,
  getAdmin,
  getSimpleContract,
  detect,
}
