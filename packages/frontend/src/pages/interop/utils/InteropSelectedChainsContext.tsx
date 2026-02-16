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
import type { SelectedChains } from '~/server/features/scaling/interop/types'
import { buildInteropUrl } from './buildInteropUrl'

interface InteropSelectedChainsContextType {
  selectedChains: SelectedChains
  allChainIds: string[]
  selectChain: (index: 0 | 1, chainId: string | null) => void
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChain[]
  initialSelectedChains: SelectedChains
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

    const newUrl = buildInteropUrl(window.location.pathname, debouncedChains)

    const currentUrl = window.location.pathname + window.location.search
    if (newUrl !== currentUrl) {
      window.history.pushState({}, '', newUrl)
    }
  }, [debouncedChains])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true
    const params = new URLSearchParams(window.location.search)
    setSelectedChains((current) =>
      parseSelectedChainsQuery(
        params.get('selectedChains') ?? undefined,
        allChainIds,
        current,
      ),
    )
  })

  const selectChain = useCallback((index: 0 | 1, chainId: string | null) => {
    setSelectedChains((prev) => {
      const oppositeIndex = index === 0 ? 1 : 0
      if (prev[oppositeIndex] === chainId || prev[index] === chainId) {
        return prev
      }

      const next = [...prev] as SelectedChains
      next[index] = chainId
      return next
    })
  }, [])

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        selectedChains,
        allChainIds,
        selectChain,
      }}
    >
      {children}
    </InteropSelectedChainsContext.Provider>
  )
}

function parseSelectedChainsQuery(
  value: string | undefined,
  allChainIds: string[],
  fallback: SelectedChains,
): SelectedChains {
  if (!value) {
    return fallback
  }

  const [first, second, ...rest] = value.split(',')
  if (!first || !second || rest.length > 0) {
    return fallback
  }

  if (!allChainIds.includes(first) || !allChainIds.includes(second)) {
    return fallback
  }

  if (first === second) {
    return fallback
  }

  return [first, second]
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
