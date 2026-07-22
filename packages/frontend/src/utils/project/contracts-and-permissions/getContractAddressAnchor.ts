import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export type ContractAddressAnchorType = 'contracts' | 'permissions'

export function getContractAddressAnchor(
  type: ContractAddressAnchorType,
  address: ChainSpecificAddress,
): string {
  return `${type}-${address}`
}
