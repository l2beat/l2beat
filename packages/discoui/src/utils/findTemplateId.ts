import type { ApiProjectChain } from '../api/types'

export function findTemplateId(
  chains: ApiProjectChain[],
  address: string | undefined,
): string | undefined {
  if (!address) {
    return undefined
  }

  for (const chain of chains) {
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return contract.template?.id
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return contract.template?.id
      }
    }
  }
  return undefined
}
