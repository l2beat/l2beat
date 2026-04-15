import { assert } from '@l2beat/shared-pure'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import type { InteropChainWithIcon } from '../../chain-selector/types'

export const MAX_SELECTED_CHAINS = 15
export const MIN_SELECTED_CHAINS = 2
export const MIN_SELECTED_PROTOCOLS = 1

interface InteropFlowsContextType {
  selectedChains: string[]
  selectedProtocols: string[]
  allChains: InteropChainWithIcon[]
  toggleChainSelection: (chainId: string) => void
  deselectAllChains: () => void
  toggleProtocolSelection: (protocolId: string) => void
  highlightedChains: string[]
  toggleHighlightedChain: (chainId: string) => void
}

export const InteropFlowsContext = createContext<
  InteropFlowsContextType | undefined
>(undefined)

interface InteropFlowsProviderProps {
  children: ReactNode
  chains: InteropChainWithIcon[]
  protocols: (ProtocolDisplayable & {
    id: string
  })[]
}

export function InteropFlowsProvider({
  children,
  chains,
  protocols,
}: InteropFlowsProviderProps) {
  const allChainIds = useMemo(() => chains.map((c) => c.id), [chains])
  const allProtocols = useMemo(
    () => protocols.map((protocol) => protocol.id),
    [protocols],
  )
  const [selectedChains, setSelectedChains] = useState<string[]>(
    allChainIds.slice(0, MAX_SELECTED_CHAINS),
  )
  const [selectedProtocols, setSelectedProtocols] =
    useState<string[]>(allProtocols)
  const [highlightedChains, setHighlightedChains] = useState<string[]>([])

  const toggleChainSelection = useCallback((chainId: string) => {
    setSelectedChains((prev) => {
      if (prev.includes(chainId)) {
        setHighlightedChains((h) => h.filter((id) => id !== chainId))
        return prev.filter((id) => id !== chainId)
      }
      if (prev.length >= MAX_SELECTED_CHAINS) {
        return prev
      }
      return [...prev, chainId]
    })
  }, [])

  const deselectAllChains = useCallback(() => {
    setSelectedChains([])
    setHighlightedChains([])
  }, [])

  const toggleProtocolSelection = useCallback((protocolId: string) => {
    setSelectedProtocols((prev) => {
      if (prev.includes(protocolId)) {
        return prev.filter((id) => id !== protocolId)
      }
      return [...prev, protocolId]
    })
  }, [])

  const toggleHighlightedChain = useCallback((chainId: string) => {
    setHighlightedChains((prev) => {
      if (prev.includes(chainId)) {
        return prev.filter((id) => id !== chainId)
      }
      if (prev.length < 2) {
        return [...prev, chainId]
      }
      assert(prev[1])
      return [prev[1], chainId]
    })
  }, [])

  return (
    <InteropFlowsContext.Provider
      value={{
        allChains: chains,
        selectedChains,
        selectedProtocols,
        toggleChainSelection,
        deselectAllChains,
        toggleProtocolSelection,
        highlightedChains,
        toggleHighlightedChain,
      }}
    >
      {children}
    </InteropFlowsContext.Provider>
  )
}

export function useInteropFlows() {
  const context = useContext(InteropFlowsContext)
  if (!context) {
    throw new Error('useInteropFlows must be used within InteropFlowsProvider')
  }
  return context
}
