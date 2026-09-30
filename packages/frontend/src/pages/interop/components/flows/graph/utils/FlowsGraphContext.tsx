import { createContext, useContext } from 'react'

/**
 * What the graph itself needs from its surroundings. Interop provides it
 * from InteropFlowsProvider; any other user of the graph provides its own.
 */
interface FlowsGraphContextType {
  /** Drawn as placeholders while data is loading */
  selectedChains: string[]
  highlightedChains: string[]
  toggleHighlightedChain: (chainId: string) => void
}

export const FlowsGraphContext = createContext<
  FlowsGraphContextType | undefined
>(undefined)

export function useFlowsGraph() {
  const context = useContext(FlowsGraphContext)
  if (!context) {
    throw new Error('useFlowsGraph must be used within FlowsGraphContext')
  }
  return context
}
