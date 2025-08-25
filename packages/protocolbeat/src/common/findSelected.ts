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
        const blockNumber = chain.blockNumbers[contract.chain]
        if (blockNumber === undefined) {
          throw new Error(`Block number for ${contract.chain} is undefined`)
        }
        return { ...contract, blockNumber }
      }
    }
    for (const contract of chain.discoveredContracts) {
      if (contract.address === address) {
        const blockNumber = chain.blockNumbers[contract.chain]
        if (blockNumber === undefined) {
          throw new Error(`Block number for ${contract.chain} is undefined`)
        }
        return { ...contract, blockNumber }
      }
    }
    for (const eoa of chain.eoas) {
      if (eoa.address === address) {
        const blockNumber = chain.blockNumbers[eoa.chain]
        if (blockNumber === undefined) {
          throw new Error(`Block number for ${eoa.chain} is undefined`)
        }
        return { ...eoa, blockNumber }
      }
    }
  }
}
