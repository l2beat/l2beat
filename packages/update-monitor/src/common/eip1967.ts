import { Contract, providers } from 'ethers'
import { bytes32ToAddress } from './address'

// keccak256('eip1967.proxy.implementation') - 1)
export const EIP1967_IMPLEMENTATION_SLOT =
  '0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc'

export async function getEip1967Implementation(
  provider: providers.JsonRpcProvider,
  contract: Contract | string,
) {
  const address = typeof contract === 'string' ? contract : contract.address
  const value = await provider.getStorageAt(
    address,
    EIP1967_IMPLEMENTATION_SLOT,
  )
  return bytes32ToAddress(value)
}
