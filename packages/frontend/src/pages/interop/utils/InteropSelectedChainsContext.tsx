import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useEventListener } from '~/hooks/useEventListener'
import { useTracking } from '~/hooks/useTracking'
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
  const debouncedSelection = useDebouncedValue(selection, 500)
  const skipNextUrlUpdate = useRef(false)

  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const currentSelection = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams(window.location.search),
      interopChainsIds: allChainIds,
    })
    if (isSameSelection(currentSelection, debouncedSelection)) {
      return
    }

    const nextUrl = buildInteropUrl(
      window.location.pathname,
      debouncedSelection,
    )

    const currentUrl = window.location.pathname + window.location.search
    if (nextUrl === currentUrl) {
      return
    }

    window.history.pushState({}, '', nextUrl)

    const chains = [
      ...new Set([...debouncedSelection.from, ...debouncedSelection.to]),
    ]
      .sort()
      .join(',')
    track('interopChainsSelected', {
      chains,
      page: window.location.pathname,
    })
  }, [debouncedSelection, allChainIds, track])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true

    const parsedSelection = parseInteropSelectionFromSearchParams({
      searchParams: new URLSearchParams(window.location.search),
      interopChainsIds: allChainIds,
    })

    setSelection(getValidInteropSelection(parsedSelection, allChainIds))
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

function isSameSelection(left: InteropSelection, right: InteropSelection) {
  return (
    left.from.length === right.from.length &&
    left.to.length === right.to.length &&
    left.from.every((value, index) => value === right.from[index]) &&
    left.to.every((value, index) => value === right.to[index])
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
