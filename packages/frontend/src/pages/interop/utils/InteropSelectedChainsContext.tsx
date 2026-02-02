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
import { buildInteropUrl } from './buildInteropUrl'

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
  swapPaths: () => void
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

  const debouncedChains = useDebouncedValue(selectedChains, 500)
  const skipNextUrlUpdate = useRef(false)

  // Sync debounced state to URL
  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const newUrl = buildInteropUrl(
      window.location.pathname,
      {
        from: debouncedChains.from,
        to: debouncedChains.to,
      },
      allChainIds,
    )

    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) {
      window.history.pushState({}, '', newUrl)
    }
  }, [debouncedChains, allChainIds])

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

  const swapPaths = useCallback(() => {
    setSelectedChains((prev) => ({
      from: prev.to,
      to: prev.from,
    }))
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
        swapPaths,
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
