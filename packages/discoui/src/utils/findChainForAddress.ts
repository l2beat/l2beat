import type { ApiProjectChain } from '../api/types'

export function isInRootDiscovery(
  projectName: string,
  chains: ApiProjectChain[],
  address: string | undefined,
): boolean {
  if (!address) {
    return false
  }

  for (const chain of chains) {
    if (chain.project !== projectName) {
      continue
    }

    // Check if address is in this chain
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return true
      }
    }

    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return true
      }
    }

    for (const eoa of chain.eoas) {
      if (eoa.address === address) {
        return true
      }
    }
  }

  return false
}
