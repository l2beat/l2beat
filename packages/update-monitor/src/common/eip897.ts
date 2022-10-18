import { constants, Contract, providers, utils } from 'ethers'

import { bytes32ToAddress } from './address'

// Functions required to be implemented by EIP-897 proxy contract.
const FN_PROXY_TYPE_SIG = '0x4555d5c9' // $ cast sig "proxyType()"
const FN_IMPLEMENTATION_SIG = '0x5c60da1b' // $ cast sig "implementation()"

export async function getEip897Implementation(
  provider: providers.Provider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  try {
    // Per EIP-897, check if proxyType() is 1 or 2
    const proxyType = await provider.call({
      to: address,
      data: FN_PROXY_TYPE_SIG,
    })
    if (!['0x1', '0x2'].includes(utils.hexStripZeros(proxyType))) {
      return constants.AddressZero
    }

    // Since proxyType is valid, call implementation()
    const implementationAddress = await provider.call({
      to: address,
      data: FN_IMPLEMENTATION_SIG,
    })
    return implementationAddress === '0x'
      ? constants.AddressZero
      : bytes32ToAddress(implementationAddress)
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.includes('Transaction reverted without a reason string')
    ) {
      // This contract doesn't support calling "proxyType()" or "implementation()"
      return constants.AddressZero
    } else {
      throw e
    }
  }
}
