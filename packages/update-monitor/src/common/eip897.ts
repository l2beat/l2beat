import { constants, Contract, providers } from 'ethers'

import { bytes32ToAddress } from './address'

// $ cast sig "implementation()"
const FN_IMPLEMENTATION_SIG = '0x5c60da1b'

export async function getEip897Implementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  try {
    const value = await provider.call({
      to: address,
      data: FN_IMPLEMENTATION_SIG,
    })
    return bytes32ToAddress(value)
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.includes('Transaction reverted without a reason string')
    ) {
      // This contract doesn't contain "implementation()"
      return constants.AddressZero
    } else {
      throw e
    }
  }
}
