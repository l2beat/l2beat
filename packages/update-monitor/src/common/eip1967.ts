import { Contract, providers } from 'ethers'

import { bytes32ToAddress } from './address'

// keccak256('eip1967.proxy.implementation') - 1)
export const EIP1967_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

export async function getEip1967Implementation(
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
export const EIP1967_ADMIN_SLOT =
  '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'

export async function getEip1967Admin(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(address, EIP1967_ADMIN_SLOT)
  return bytes32ToAddress(value)
}
