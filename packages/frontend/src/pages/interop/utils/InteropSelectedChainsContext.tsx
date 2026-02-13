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
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { buildInteropUrl } from './buildInteropUrl'

export type InteropSelectedChain = {
  id: string
  iconUrl: string
}

export type InteropSelectedChains = [
  InteropSelectedChain | undefined,
  InteropSelectedChain | undefined,
]

interface InteropSelectedChainsContextType {
  selectedChains: InteropSelectedChains
  allChainIds: string[]
  selectChain: (index: 0 | 1, chainId: string) => void
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
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
  const [selectedChainIds, setSelectedChainIds] = useState(
    initialSelectedChains,
  )

  const debouncedChains = useDebouncedValue(selectedChainIds, 500)
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
    setSelectedChainIds((current) =>
      parseSelectedChainsQuery(
        params.get('selectedChains') ?? undefined,
        allChainIds,
        current,
      ),
    )
  })

  const selectChain = useCallback((index: 0 | 1, chainId: string) => {
    setSelectedChainIds((prev) => {
      const oppositeIndex = index === 0 ? 1 : 0
      if (prev[oppositeIndex] === chainId || prev[index] === chainId) {
        return prev
      }

      const next = [...prev] as SelectedChains
      next[index] = chainId
      return next
    })
  }, [])

  const interopChainsById = useMemo(
    () => new Map(interopChains.map((chain) => [chain.id, chain])),
    [interopChains],
  )

  const selectedChains = useMemo(() => {
    return selectedChainIds.map((chainId) => {
      if (!chainId) {
        return undefined
      }

      const chain = interopChainsById.get(chainId)
      if (!chain) {
        return undefined
      }

      return {
        id: chain.id,
        iconUrl: chain.iconUrl,
      }
    }) as InteropSelectedChains
  }, [selectedChainIds, interopChainsById])

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
