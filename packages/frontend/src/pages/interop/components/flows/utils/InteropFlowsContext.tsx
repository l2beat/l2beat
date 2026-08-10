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
  pinnedChainId: string | undefined
  toggleProtocolSelection: (protocolId: string) => void
  selectAllProtocols: () => void
  deselectAllProtocols: () => void
  setSelectedProtocols: (protocolIds: string[]) => void
  highlightedChains: string[]
  toggleHighlightedChain: (chainId: string) => void
  setHighlightedChainPair: (chainIdA: string, chainIdB: string) => void
}

export const InteropFlowsContext = createContext<
  InteropFlowsContextType | undefined
>(undefined)

export type InteropFlowsProtocol = ProtocolDisplayable & {
  id: string
}

interface InteropFlowsProviderProps {
  children: ReactNode
  chains: InteropChainWithIcon[]
  protocols: InteropFlowsProtocol[]
  defaultSelectedChains: string[]
  pinnedChainId?: string
}

export function InteropFlowsProvider({
  children,
  chains,
  protocols,
  defaultSelectedChains = [],
  pinnedChainId: providedPinnedChainId,
}: InteropFlowsProviderProps) {
  const allChainIds = useMemo(() => chains.map((c) => c.id), [chains])
  const pinnedChainId = useMemo(
    () =>
      providedPinnedChainId && allChainIds.includes(providedPinnedChainId)
        ? providedPinnedChainId
        : undefined,
    [allChainIds, providedPinnedChainId],
  )
  const allProtocolIds = useMemo(
    () => protocols.map((protocol) => protocol.id),
    [protocols],
  )

  const defaultSelectedChainIds = useMemo(() => {
    const provided = new Set(defaultSelectedChains)
    const selected = allChainIds.filter((id) => provided.has(id))
    return [
      ...(pinnedChainId ? [pinnedChainId] : []),
      ...selected.filter((id) => id !== pinnedChainId),
    ].slice(0, MAX_SELECTED_CHAINS)
  }, [allChainIds, defaultSelectedChains, pinnedChainId])

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
    const unlockedSelectedChains = allChainIds.filter(
      (id) => id !== pinnedChainId && parsed.includes(id),
    )
    return [
      ...(pinnedChainId ? [pinnedChainId] : []),
      ...unlockedSelectedChains,
    ].slice(0, MAX_SELECTED_CHAINS)
  }, [chainsParam, allChainIds, pinnedChainId])

  const [highlightedChainIds, setHighlightedChainIds] = useState<string[]>([])
  const highlightedChains = useMemo(
    () =>
      [
        ...new Set([
          ...(pinnedChainId ? [pinnedChainId] : []),
          ...highlightedChainIds,
        ]),
      ].slice(0, 2),
    [highlightedChainIds, pinnedChainId],
  )
  const selectedProtocols = useMemo(
    () => parseIdsParam(protocolsParam, allProtocolIds),
    [protocolsParam, allProtocolIds],
  )

  const setSelectedChains = useCallback(
    (next: string[]) => {
      // Keep canonical order so that a selection equal to the default serializes identically and gets removed from the URL
      const unlockedSelectedChains = allChainIds.filter(
        (id) => id !== pinnedChainId && next.includes(id),
      )
      const canonical = [
        ...(pinnedChainId ? [pinnedChainId] : []),
        ...unlockedSelectedChains,
      ].slice(0, MAX_SELECTED_CHAINS)
      setChainsParam(canonical.join(','))
    },
    [allChainIds, pinnedChainId, setChainsParam],
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
      if (chainId === pinnedChainId) {
        return
      }
      if (selectedChains.includes(chainId)) {
        setHighlightedChainIds((h) => h.filter((id) => id !== chainId))
        setSelectedChains(selectedChains.filter((id) => id !== chainId))
        return
      }
      if (selectedChains.length >= MAX_SELECTED_CHAINS) {
        return
      }
      setSelectedChains([...selectedChains, chainId])
    },
    [pinnedChainId, selectedChains, setSelectedChains],
  )

  const deselectAllChains = useCallback(() => {
    setSelectedChains(pinnedChainId ? [pinnedChainId] : [])
    setHighlightedChainIds([])
  }, [pinnedChainId, setSelectedChains])

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

  const setHighlightedChainPair = useCallback(
    (chainIdA: string, chainIdB: string) => {
      if (!pinnedChainId) {
        setHighlightedChainIds([chainIdA, chainIdB])
        return
      }
      const other = [chainIdA, chainIdB].find((id) => id !== pinnedChainId)
      setHighlightedChainIds(other ? [other] : [])
    },
    [pinnedChainId],
  )

  const toggleHighlightedChain = useCallback(
    (chainId: string) => {
      setHighlightedChainIds((prev) => {
        if (!pinnedChainId) {
          if (prev.includes(chainId)) {
            return prev.filter((id) => id !== chainId)
          }
          if (prev.length < 2) {
            return [...prev, chainId]
          }
          const previousSecond = prev[1]
          return previousSecond ? [previousSecond, chainId] : [chainId]
        }

        if (chainId === pinnedChainId) {
          return prev
        }

        if (prev.includes(chainId)) {
          return prev.filter((id) => id !== chainId)
        }

        return [chainId]
      })
    },
    [pinnedChainId],
  )

  return (
    <InteropFlowsContext.Provider
      value={{
        allChains: chains,
        selectedChains,
        pinnedChainId,
        selectedProtocols,
        toggleChainSelection,
        deselectAllChains,
        toggleProtocolSelection,
        selectAllProtocols,
        deselectAllProtocols,
        setSelectedProtocols,
        highlightedChains,
        toggleHighlightedChain,
        setHighlightedChainPair,
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
