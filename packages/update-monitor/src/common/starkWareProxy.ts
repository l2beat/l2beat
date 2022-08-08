import { Contract, providers } from 'ethers'

import { bytes32ToAddress } from './address'

// keccak256("StarkWare2019.implemntation-slot")
export const STARK_WARE_2019_IMPLEMENTATION_SLOT =
  '0x177667240aeeea7e35eabe3a35e18306f336219e1386f7710a6bf8783f761b24'

export const STARKWARE_CALL_PROXY_2020_IMPLEMENTATION_SLOT =
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be'

export async function getStarkWare2019Implementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    STARK_WARE_2019_IMPLEMENTATION_SLOT,
  )
  return bytes32ToAddress(value)
}

export async function getStarkWare2020CallProxyImplementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    STARKWARE_CALL_PROXY_2020_IMPLEMENTATION_SLOT,
  )
  return bytes32ToAddress(value)
}
