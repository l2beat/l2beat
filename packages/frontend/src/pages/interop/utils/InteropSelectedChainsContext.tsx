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
import type { SelectedChainsIds } from '~/server/features/scaling/interop/types'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { buildInteropUrl } from './buildInteropUrl'

export type InteropSelectedChain = {
  id: string
  iconUrl: string
}

export type InteropSelectedChains = {
  first: InteropSelectedChain | undefined
  second: InteropSelectedChain | undefined
}

interface InteropSelectedChainsContextType {
  selectedChains: InteropSelectedChains
  allChainIds: string[]
  selectChain: (
    index: keyof InteropSelectedChainsContextType['selectedChains'],
    chainId: string | null,
  ) => void
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  interopChains: InteropChainWithIcon[]
  initialSelectedChains: SelectedChainsIds
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
  const defaultSelectedChains = useMemo(
    () => ({
      first: getInteropSelectedChainFromId(
        initialSelectedChains[0],
        interopChains,
      ),
      second: getInteropSelectedChainFromId(
        initialSelectedChains[1],
        interopChains,
      ),
    }),
    [initialSelectedChains, interopChains],
  )
  const [selectedChains, setSelectedChains] = useState(defaultSelectedChains)

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
      if (window.location.search === '') {
        window.history.replaceState({}, '', newUrl)
        return
      }
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
        interopChains,
        current,
      ),
    )
  })

  const selectChain = useCallback(
    (index: keyof InteropSelectedChains, chainId: string | null) => {
      setSelectedChains((prev) => {
        const chain = getInteropSelectedChainFromId(chainId, interopChains)
        if (!chain) {
          return prev
        }
        return {
          ...prev,
          [index]: chain,
        }
      })
    },
    [interopChains],
  )

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

function getInteropSelectedChainFromId(
  id: string | undefined,
  interopChains: InteropChainWithIcon[],
): InteropSelectedChain | undefined {
  if (!id) {
    return undefined
  }
  const interopChain = interopChains.find((c) => c.id === id)
  if (!interopChain) {
    return undefined
  }
  return {
    id: interopChain.id,
    iconUrl: interopChain.iconUrl,
  }
}

function parseSelectedChainsQuery(
  value: string | undefined,
  allChainIds: string[],
  interopChains: InteropChainWithIcon[],
  fallback: InteropSelectedChains,
): InteropSelectedChains {
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

  const firstChain = getInteropSelectedChainFromId(first, interopChains)
  const secondChain = getInteropSelectedChainFromId(second, interopChains)

  if (!firstChain || !secondChain) {
    return fallback
  }

  return {
    first: firstChain,
    second: secondChain,
  }
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
