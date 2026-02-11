import type { InteropChain } from '@l2beat/config'
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
    first: string | undefined
    second: string | undefined
  }
  allChainIds: string[]
  toggleFirst: (chainId: string) => void
  toggleSecond: (chainId: string) => void
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChain[]
  initialSelectedChains: {
    first: string | undefined
    second: string | undefined
  }
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

    const newUrl = buildInteropUrl(window.location.pathname, {
      first: debouncedChains.first,
      second: debouncedChains.second,
    })

    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) {
      window.history.pushState({}, '', newUrl)
    }
  }, [debouncedChains])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true
    const params = new URLSearchParams(window.location.search)
    setSelectedChains({
      first: parseChainIdsFromUrl(params.get('first'), allChainIds),
      second: parseChainIdsFromUrl(params.get('second'), allChainIds),
    })
  })

  const toggleFirst = useCallback((chainId: string) => {
    setSelectedChains((prev) => ({
      ...prev,
      first: chainId,
    }))
  }, [])

  const toggleSecond = useCallback((chainId: string) => {
    setSelectedChains((prev) => ({
      ...prev,
      second: chainId,
    }))
  }, [])

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        selectedChains,
        allChainIds,
        toggleFirst,
        toggleSecond,
      }}
    >
      {children}
    </InteropSelectedChainsContext.Provider>
  )
}

function parseChainIdsFromUrl(
  param: string | null,
  allChainIds: string[],
): string | undefined {
  if (!param) return undefined
  const id = param
  if (allChainIds.includes(id)) {
    return id
  }
  return undefined
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
