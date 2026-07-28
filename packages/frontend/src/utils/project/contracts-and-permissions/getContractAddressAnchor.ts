import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export type ContractAddressAnchorType = 'contracts' | 'permissions'

export function getContractAddressAnchor(
  type: ContractAddressAnchorType,
  address: ChainSpecificAddress,
): string {
  return `${type}-${address}`
}

export function createAddressAnchors(type: ContractAddressAnchorType) {
  const seen = new Set<ChainSpecificAddress>()

  return (address: ChainSpecificAddress): string | undefined => {
    if (seen.has(address)) {
      return undefined
    }

    seen.add(address)
    return getContractAddressAnchor(type, address)
  }
}
