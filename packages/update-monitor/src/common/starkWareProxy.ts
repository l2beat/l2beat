import { Contract, providers } from 'ethers'

import { bytes32ToAddress } from './address'

export const STARKWARE_CALL_PROXY_2020_IMPLEMENTATION_SLOT =
  '0x7184681641399eb4ad2fdb92114857ee6ff239f94ad635a1779978947b8843be'

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
