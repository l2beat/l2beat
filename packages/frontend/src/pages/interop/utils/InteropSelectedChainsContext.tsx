import type { InteropChain } from '@l2beat/config'
import xor from 'lodash/xor'
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

interface InteropSelectedChainsContextType {
  selectedChains: {
    from: string[]
    to: string[]
  }
  allChainIds: string[]
  toggleFrom: (chainId: string) => void
  toggleTo: (chainId: string) => void
  reset: () => void
  isDirty: boolean
  setPath: (paths: { from: string; to: string }) => void
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChain[]
  initialSelectedChains: { from: string[]; to: string[] }
}

export function InteropSelectedChainsProvider({
  children,
  interopChains,
  initialSelectedChains,
}: InteropSelectedChainsProviderProps) {
  const allChainIds = useMemo(
    () => interopChains.map((c) => c.id),
    [interopChains],
  )
  const [selectedChains, setSelectedChains] = useState(initialSelectedChains)

  // Debounce URL updates (500ms delay)
  const debouncedChains = useDebouncedValue(selectedChains, 500)

  // Track if change came from popstate (to skip URL update)
  const skipNextUrlUpdate = useRef(false)

  // Sync debounced state to URL
  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const params = new URLSearchParams(window.location.search)

    if (debouncedChains.from.length < allChainIds.length) {
      params.set('from', debouncedChains.from.join(','))
    } else {
      params.delete('from')
    }

    if (debouncedChains.to.length < allChainIds.length) {
      params.set('to', debouncedChains.to.join(','))
    } else {
      params.delete('to')
    }

    const newUrl =
      params.size > 0
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname

    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) {
      window.history.pushState({}, '', newUrl)
    }
  }, [debouncedChains, allChainIds])

  // Listen for browser back/forward
  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true
    const params = new URLSearchParams(window.location.search)
    setSelectedChains({
      from: parseChainIdsFromUrl(params.get('from'), allChainIds),
      to: parseChainIdsFromUrl(params.get('to'), allChainIds),
    })
  })

  const toggleFrom = useCallback((chainId: string) => {
    setSelectedChains((prev) => ({
      ...prev,
      from: xor(prev.from, [chainId]),
    }))
  }, [])

  const toggleTo = useCallback((chainId: string) => {
    setSelectedChains((prev) => ({
      ...prev,
      to: xor(prev.to, [chainId]),
    }))
  }, [])

  const reset = useCallback(() => {
    setSelectedChains({
      from: allChainIds,
      to: allChainIds,
    })
  }, [allChainIds])

  const isDirty = useMemo(() => {
    return (
      selectedChains.from.length !== allChainIds.length ||
      selectedChains.to.length !== allChainIds.length
    )
  }, [selectedChains, allChainIds])

  const setPath = useCallback((paths: { from: string; to: string }) => {
    setSelectedChains({
      from: [paths.from],
      to: [paths.to],
    })
  }, [])

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        selectedChains,
        allChainIds,
        toggleFrom,
        toggleTo,
        reset,
        isDirty,
        setPath,
      }}
    >
      {children}
    </InteropSelectedChainsContext.Provider>
  )
}

function parseChainIdsFromUrl(
  param: string | null,
  allChainIds: string[],
): string[] {
  if (!param) return allChainIds
  const ids = param.split(',').filter((id) => allChainIds.includes(id))
  return ids.length > 0 ? ids : allChainIds
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
