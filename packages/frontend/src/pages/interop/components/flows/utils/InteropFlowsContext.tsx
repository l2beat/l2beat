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
import { MAX_SELECTED_CHAINS } from '../consts'

const CHAINS_QUERY_KEY = 'chains'
const PROTOCOLS_QUERY_KEY = 'protocols'

interface InteropFlowsContextType {
  selectedChains: string[]
  selectedProtocols: string[]
  allChains: InteropChainWithIcon[]
  toggleChainSelection: (chainId: string) => void
  deselectAllChains: () => void
  lockedChainIds: string[]
  toggleProtocolSelection: (protocolId: string) => void
  selectAllProtocols: () => void
  deselectAllProtocols: () => void
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
  defaultSelectedChains: string[]
  defaultHighlightedChains?: [] | [string] | [string, string]
  lockedChainIds?: string[]
}

export function InteropFlowsProvider({
  children,
  chains,
  protocols,
  defaultSelectedChains,
  defaultHighlightedChains = [],
  lockedChainIds: providedLockedChainIds = [],
}: InteropFlowsProviderProps) {
  const allChainIds = useMemo(() => chains.map((c) => c.id), [chains])
  const lockedChainIds = useMemo(
    () => allChainIds.filter((id) => providedLockedChainIds.includes(id)),
    [allChainIds, providedLockedChainIds],
  )
  const allProtocolIds = useMemo(
    () => protocols.map((protocol) => protocol.id),
    [protocols],
  )

  const defaultSelectedChainIds = useMemo(() => {
    const provided = new Set(defaultSelectedChains)
    return allChainIds
      .filter((id) => provided.has(id))
      .slice(0, MAX_SELECTED_CHAINS)
  }, [allChainIds, defaultSelectedChains])

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

  const selectedChains = useMemo(() => {
    const parsed = parseIdsParam(chainsParam, allChainIds)
    return allChainIds
      .filter((id) => lockedChainIds.includes(id) || parsed.includes(id))
      .slice(0, MAX_SELECTED_CHAINS)
  }, [chainsParam, allChainIds, lockedChainIds])
  const selectedProtocols = useMemo(
    () => parseIdsParam(protocolsParam, allProtocolIds),
    [protocolsParam, allProtocolIds],
  )

  const [highlightedChains, setHighlightedChains] = useState<string[]>(
    defaultHighlightedChains.filter((id) => allChainIds.includes(id)),
  )

  const setSelectedChains = useCallback(
    (next: string[]) => {
      // Keep canonical order so that a selection equal to the default serializes identically and gets removed from the URL
      const canonical = allChainIds.filter(
        (id) => lockedChainIds.includes(id) || next.includes(id),
      )
      setChainsParam(canonical.join(','))
    },
    [allChainIds, lockedChainIds, setChainsParam],
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
      if (lockedChainIds.includes(chainId)) {
        return
      }
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
    [lockedChainIds, selectedChains, setSelectedChains],
  )

  const deselectAllChains = useCallback(() => {
    setSelectedChains(lockedChainIds)
    setHighlightedChains((chains) =>
      chains.filter((id) => lockedChainIds.includes(id)),
    )
  }, [lockedChainIds, setSelectedChains])

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

  const selectAllProtocols = useCallback(() => {
    setSelectedProtocols(allProtocolIds)
  }, [allProtocolIds, setSelectedProtocols])

  const deselectAllProtocols = useCallback(() => {
    setSelectedProtocols([])
  }, [setSelectedProtocols])

  const toggleHighlightedChain = useCallback(
    (chainId: string) => {
      setHighlightedChains((prev) => {
        if (lockedChainIds.length === 0) {
          if (prev.includes(chainId)) {
            return prev.filter((id) => id !== chainId)
          }
          if (prev.length < 2) {
            return [...prev, chainId]
          }
          const previousSecond = prev[1]
          return previousSecond ? [previousSecond, chainId] : [chainId]
        }

        const lockedHighlightedChains = lockedChainIds.filter((id) =>
          selectedChains.includes(id),
        )

        if (lockedChainIds.includes(chainId)) {
          return prev.includes(chainId)
            ? uniqueChains([...lockedHighlightedChains, ...prev]).slice(0, 2)
            : uniqueChains([
                ...lockedHighlightedChains,
                chainId,
                ...prev,
              ]).slice(0, 2)
        }

        if (prev.includes(chainId)) {
          return uniqueChains([
            ...lockedHighlightedChains,
            ...prev.filter((id) => id !== chainId),
          ]).slice(0, 2)
        }

        return uniqueChains([...lockedHighlightedChains, chainId]).slice(0, 2)
      })
    },
    [lockedChainIds, selectedChains],
  )

  return (
    <InteropFlowsContext.Provider
      value={{
        allChains: chains,
        selectedChains,
        lockedChainIds,
        selectedProtocols,
        toggleChainSelection,
        deselectAllChains,
        toggleProtocolSelection,
        selectAllProtocols,
        deselectAllProtocols,
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

function uniqueChains(chainIds: string[]) {
  return [...new Set(chainIds)]
}
