import type { ApiProjectChain, ApiProjectResponse } from '../api/types'
import { getEntrypointGroupIdFromNodeId } from '../apps/discovery/panel-nodes/store/utils/entrypointGroups'

export function findSelected(
  chains: ApiProjectChain[],
  address: string | undefined,
  entrypointGroups: ApiProjectResponse['entrypointGroups'] = [],
) {
  if (!address) {
    return
  }

  const groupId = getEntrypointGroupIdFromNodeId(address)
  if (groupId) {
    const group = entrypointGroups.find((entry) => entry.id === groupId)
    if (group) {
      const bridgeAddress =
        group.bridgeAddresses[0] ?? group.memberAddresses[0]
      if (bridgeAddress) {
        return findSelected(chains, bridgeAddress, entrypointGroups)
      }
      return group
    }
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
