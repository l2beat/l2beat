import { MAX_SELECTED_CHAINS } from '../components/flows/consts'

// Shared by Home and the interop summary page so their flows charts default
// to the same selection: chains ordered by flow volume, top ones selected.
export function selectDefaultFlowChains<T extends { id: string }>(
  chains: T[],
  flowChainOrder: string[],
): { sortedChains: T[]; defaultSelectedFlowChains: string[] } {
  const chainsById = new Map(chains.map((chain) => [chain.id, chain]))
  const sortedChains = flowChainOrder
    .map((chainId) => chainsById.get(chainId))
    .filter((chain) => chain !== undefined)
  return {
    sortedChains,
    defaultSelectedFlowChains: sortedChains
      .slice(0, MAX_SELECTED_CHAINS)
      .map((chain) => chain.id),
  }
}
