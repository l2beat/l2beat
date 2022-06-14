import { providers } from 'ethers'

import { toAddress } from './cast'
import { createCompare } from './compare'

async function getEip1967Implementation(
  provider: providers.Provider,
  address: string,
) {
  const SLOT =
    '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkEip1967Implementation = createCompare(
  'EIP-1967 implementation',
  getEip1967Implementation,
)

async function getEip1967Admin(provider: providers.Provider, address: string) {
  const SLOT =
    '0xb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103'
  const result = await provider.getStorageAt(address, SLOT)
  return toAddress(result)
}

export const checkEip1967Admin = createCompare(
  'EIP-1967 admin',
  getEip1967Admin,
)
