import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useTracking } from '~/hooks/useTracking'
import { useUrlStateSync } from '~/hooks/useUrlStateSync'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { buildInteropUrl } from './buildInteropUrl'
import { getValidInteropSelection } from './getValidInteropSelection'
import { parseInteropSelectionFromSearchParams } from './parseInteropSelectionFromSearchParams'
import { toggleSelection } from './toggleSelection'
import type { InteropSelection } from './types'

interface InteropSelectedChainsContextType {
  selectedChains: InteropSelection
  allChainIds: string[]
  getChainById: (chainId: string) => InteropChainWithIcon | undefined
  selectChain: (type: 'from' | 'to', chainId: string | null) => void
  toggleFrom: (chainId: string) => void
  toggleTo: (chainId: string) => void
  selectAll: (type?: 'from' | 'to') => void
  deselectAll: (type?: 'from' | 'to') => void
  swapPaths: () => void
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
  initialSelection: InteropSelection
}

export function InteropSelectedChainsProvider({
  children,
  interopChains,
  initialSelection,
}: InteropSelectedChainsProviderProps) {
  const allChainIds = useMemo(
    () => interopChains.map((c) => c.id),
    [interopChains],
  )
  const chainsById = useMemo(
    () => new Map(interopChains.map((chain) => [chain.id, chain])),
    [interopChains],
  )

  const normalizedInitialSelection = useMemo(
    () => getValidInteropSelection(initialSelection, allChainIds),
    [initialSelection, allChainIds],
  )

  const [selection, setSelection] = useState(normalizedInitialSelection)

  useEffect(() => {
    setSelection(normalizedInitialSelection)
  }, [normalizedInitialSelection])

  const getChainById = useCallback(
    (chainId: string) => chainsById.get(chainId),
    [chainsById],
  )

  const { track } = useTracking()
  useUrlStateSync({
    state: selection,
    debounceMs: 500,
    parse: (searchParams) =>
      parseInteropSelectionFromSearchParams({
        searchParams,
        interopChainsIds: allChainIds,
      }),
    build: buildInteropUrl,
    onPopState: (parsed) =>
      setSelection(getValidInteropSelection(parsed, allChainIds)),
    onPushState: (_url, pushed) => {
      const chains = [...new Set([...pushed.from, ...pushed.to])]
        .sort()
        .join(',')
      track('interopChainsSelected', {
        chains,
        page: window.location.pathname,
      })
    },
  })

  const selectChain = useCallback(
    (type: 'from' | 'to', chainId: string | null) => {
      setSelection((prev) => {
        const opposite = type === 'from' ? prev.to : prev.from

        if (chainId && opposite.length === 1 && opposite[0] === chainId) {
          return prev
        }

        return {
          ...prev,
          [type]: chainId ? [chainId] : [],
        }
      })
    },
    [],
  )

  const toggleFrom = useCallback(
    (chainId: string) => {
      setSelection((prev) => ({
        ...prev,
        from: toggleSelection(prev.from, chainId, allChainIds),
      }))
    },
    [allChainIds],
  )

  const toggleTo = useCallback(
    (chainId: string) => {
      setSelection((prev) => ({
        ...prev,
        to: toggleSelection(prev.to, chainId, allChainIds),
      }))
    },
    [allChainIds],
  )

  const selectAll = useCallback(
    (type?: 'from' | 'to') => {
      setSelection((prev) => ({
        ...prev,
        ...(type
          ? { [type]: allChainIds }
          : { from: allChainIds, to: allChainIds }),
      }))
    },
    [allChainIds],
  )

  const deselectAll = useCallback((type?: 'from' | 'to') => {
    setSelection((prev) => ({
      ...prev,
      ...(type ? { [type]: [] } : { from: [], to: [] }),
    }))
  }, [])

  const swapPaths = useCallback(() => {
    setSelection((prev) => ({
      from: prev.to,
      to: prev.from,
    }))
  }, [])

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        selectedChains: selection,
        allChainIds,
        getChainById,
        selectChain,
        toggleFrom,
        toggleTo,
        selectAll,
        deselectAll,
        swapPaths,
      }}
    >
      {children}
    </InteropSelectedChainsContext.Provider>
  )
}

export function useInteropSelectedChains() {
  const context = useContext(InteropSelectedChainsContext)
  if (!context) {
    throw new Error(
      'useInteropSelectedChains must be used within InteropSelectedChainsProvider',
    )
  }
  return context
}
