import type { ApiProjectChain } from '../api/types'

export function findSelected(
  chains: ApiProjectChain[],
  address: string | undefined,
) {
  if (!address) {
    return
  }
  for (const chain of chains) {
    for (const contract of chain.initialContracts) {
      if (contract.address === address) {
        return {
          ...contract,
          chain: chain.chain,
          blockNumber: chain.blockNumber,
        }
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        return {
          ...contract,
          chain: chain.chain,
          blockNumber: chain.blockNumber,
        }
      }
    }
    for (const eoa of chain.eoas) {
      if (eoa.address === address) {
        return {
          ...eoa,
          chain: chain.chain,
          blockNumber: chain.blockNumber,
        }
      }
    }
  }
}
