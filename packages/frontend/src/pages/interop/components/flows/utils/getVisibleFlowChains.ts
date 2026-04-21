import type { Flow } from '~/server/features/scaling/interop/getInteropFlows'

export interface FlowChainDisplayState {
  activeChainIds: string[]
  inactiveChainIds: string[]
}

export function getVisibleFlowChains(
  selectedChainIds: string[],
  flows: Flow[],
): FlowChainDisplayState {
  const activeIds = new Set<string>()

  for (const flow of flows) {
    activeIds.add(flow.srcChain)
    activeIds.add(flow.dstChain)
  }

  return {
    activeChainIds: selectedChainIds.filter((chainId) =>
      activeIds.has(chainId),
    ),
    inactiveChainIds: selectedChainIds.filter(
      (chainId) => !activeIds.has(chainId),
    ),
  }
}

export function getVisibleHighlightedChains(
  highlightedChainIds: string[],
  visibleChainIds: string[],
) {
  const visibleIds = new Set(visibleChainIds)
  return highlightedChainIds.filter((chainId) => visibleIds.has(chainId))
}
