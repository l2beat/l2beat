import { assert } from '@l2beat/shared-pure'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { useQueryParam } from '~/hooks/useQueryParam'
import type { ProtocolDisplayable } from '~/server/features/scaling/interop/types'
import type { InteropChainWithIcon } from '../../chain-selector/types'

export const MAX_SELECTED_CHAINS = 15
export const MIN_SELECTED_CHAINS = 2
export const MIN_SELECTED_PROTOCOLS = 1

const CHAINS_QUERY_KEY = 'chains'
const PROTOCOLS_QUERY_KEY = 'protocols'

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
  const allProtocolIds = useMemo(
    () => protocols.map((protocol) => protocol.id),
    [protocols],
  )

  const defaultSelectedChainIds = useMemo(
    () => allChainIds.slice(0, MAX_SELECTED_CHAINS),
    [allChainIds],
  )

  const [chainsParam, setChainsParam] = useQueryParam(
    CHAINS_QUERY_KEY,
    defaultSelectedChainIds.join(','),
    { replaceState: true },
  )
  const [protocolsParam, setProtocolsParam] = useQueryParam(
    PROTOCOLS_QUERY_KEY,
    allProtocolIds.join(','),
    { replaceState: true },
  )

  const selectedChains = useMemo(
    () => parseIdsParam(chainsParam, allChainIds).slice(0, MAX_SELECTED_CHAINS),
    [chainsParam, allChainIds],
  )
  const selectedProtocols = useMemo(
    () => parseIdsParam(protocolsParam, allProtocolIds),
    [protocolsParam, allProtocolIds],
  )

  const [highlightedChains, setHighlightedChains] = useState<string[]>([])

  const setSelectedChains = useCallback(
    (next: string[]) => {
      // Keep canonical order so that a selection equal to the default serializes identically and gets removed from the URL
      const canonical = allChainIds.filter((id) => next.includes(id))
      setChainsParam(canonical.join(','))
    },
    [allChainIds, setChainsParam],
  )

  const setSelectedProtocols = useCallback(
    (next: string[]) => {
      const canonical = allProtocolIds.filter((id) => next.includes(id))
      setProtocolsParam(canonical.join(','))
    },
    [allProtocolIds, setProtocolsParam],
  )

  const toggleChainSelection = useCallback(
    (chainId: string) => {
      if (selectedChains.includes(chainId)) {
        setHighlightedChains((h) => h.filter((id) => id !== chainId))
        setSelectedChains(selectedChains.filter((id) => id !== chainId))
        return
      }
      if (selectedChains.length >= MAX_SELECTED_CHAINS) {
        return
      }
      setSelectedChains([...selectedChains, chainId])
    },
    [selectedChains, setSelectedChains],
  )

  const deselectAllChains = useCallback(() => {
    setSelectedChains([])
    setHighlightedChains([])
  }, [setSelectedChains])

  const toggleProtocolSelection = useCallback(
    (protocolId: string) => {
      if (selectedProtocols.includes(protocolId)) {
        setSelectedProtocols(
          selectedProtocols.filter((id) => id !== protocolId),
        )
        return
      }
      setSelectedProtocols([...selectedProtocols, protocolId])
    },
    [selectedProtocols, setSelectedProtocols],
  )

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

function parseIdsParam(value: string, validIds: string[]): string[] {
  if (!value) return []
  const provided = new Set(value.split(','))
  return validIds.filter((id) => provided.has(id))
}
