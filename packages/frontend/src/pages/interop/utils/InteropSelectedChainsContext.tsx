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
import {
  normalizeDirectionalSelection,
  parseDirectionalSelectionFromQueryValue,
  serializeDirectionalSelectionToQueryValue,
} from './directionalSelection'
import type { DirectionalSelectedChains } from './getInitialDirectionalSelectedChains'

export type InteropMode = 'public' | 'internal'

export type InteropSelectedChain = {
  id: string
  iconUrl: string
}

export type InteropPublicSelectedChains = {
  first: InteropSelectedChain | null
  second: InteropSelectedChain | null
}

export type InteropSelectedChains = InteropPublicSelectedChains &
  DirectionalSelectedChains

export type InteropApiSelectionInput =
  | {
      selectedChainsIds: SelectedChainsIds
      from?: undefined
      to?: undefined
    }
  | {
      selectedChainsIds?: undefined
      from: string[]
      to: string[]
    }

interface InteropSelectedChainsContextType {
  mode: InteropMode
  selectedChains: InteropSelectedChains
  allChainIds: string[]
  selectChain: (
    index: keyof InteropPublicSelectedChains,
    chainId: string | null,
  ) => void
  toggleFrom: (chainId: string) => void
  toggleTo: (chainId: string) => void
  selectAll: (type?: 'from' | 'to') => void
  deselectAll: (type?: 'from' | 'to') => void
  swapPaths: () => void
  reset: () => void
  isDirty: boolean
  apiSelectionInput: InteropApiSelectionInput
  buildUrl: (path: string) => string
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  mode: InteropMode
  interopChains: InteropChainWithIcon[]
  initialSelectedChains: SelectedChainsIds
  initialDirectionalSelectedChains?: DirectionalSelectedChains
}

export function InteropSelectedChainsProvider({
  children,
  mode,
  interopChains,
  initialSelectedChains,
  initialDirectionalSelectedChains,
}: InteropSelectedChainsProviderProps) {
  const allChainIds = useMemo(
    () => interopChains.map((c) => c.id),
    [interopChains],
  )

  const defaultPublicSelectedChains = useMemo(
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

  const defaultDirectionalSelectedChains = useMemo(
    () => ({
      from: normalizeDirectionalSelection(
        initialDirectionalSelectedChains?.from ?? allChainIds,
        allChainIds,
        'all',
      ),
      to: normalizeDirectionalSelection(
        initialDirectionalSelectedChains?.to ?? allChainIds,
        allChainIds,
        'all',
      ),
    }),
    [initialDirectionalSelectedChains, allChainIds],
  )

  const [publicSelectedChains, setPublicSelectedChains] = useState(
    defaultPublicSelectedChains,
  )
  const [directionalSelectedChains, setDirectionalSelectedChains] = useState(
    defaultDirectionalSelectedChains,
  )

  useEffect(() => {
    setPublicSelectedChains(defaultPublicSelectedChains)
  }, [defaultPublicSelectedChains])

  useEffect(() => {
    setDirectionalSelectedChains(defaultDirectionalSelectedChains)
  }, [defaultDirectionalSelectedChains])

  const selectedChains = useMemo((): InteropSelectedChains => {
    if (mode === 'public') {
      return {
        ...publicSelectedChains,
        from: publicSelectedChains.first ? [publicSelectedChains.first.id] : [],
        to: publicSelectedChains.second ? [publicSelectedChains.second.id] : [],
      }
    }

    return {
      first: null,
      second: null,
      from: directionalSelectedChains.from,
      to: directionalSelectedChains.to,
    }
  }, [mode, publicSelectedChains, directionalSelectedChains])

  const apiSelectionInput = useMemo((): InteropApiSelectionInput => {
    if (mode === 'public') {
      return {
        selectedChainsIds: [
          publicSelectedChains.first?.id ?? null,
          publicSelectedChains.second?.id ?? null,
        ],
      }
    }

    return {
      from: directionalSelectedChains.from,
      to: directionalSelectedChains.to,
    }
  }, [mode, publicSelectedChains, directionalSelectedChains])

  const buildUrl = useCallback(
    (path: string) => {
      if (mode === 'public') {
        return buildInteropUrl(path, publicSelectedChains)
      }

      return buildDirectionalInteropUrl(
        path,
        directionalSelectedChains,
        allChainIds,
      )
    },
    [mode, publicSelectedChains, directionalSelectedChains, allChainIds],
  )

  const debouncedPublicChains = useDebouncedValue(publicSelectedChains, 500)
  const debouncedDirectionalChains = useDebouncedValue(
    directionalSelectedChains,
    500,
  )
  const skipNextUrlUpdate = useRef(false)

  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const newUrl =
      mode === 'public'
        ? buildInteropUrl(window.location.pathname, debouncedPublicChains)
        : buildDirectionalInteropUrl(
            window.location.pathname,
            debouncedDirectionalChains,
            allChainIds,
          )

    const currentUrl = window.location.pathname + window.location.search

    if (newUrl !== currentUrl) {
      if (window.location.search === '') {
        window.history.replaceState({}, '', newUrl)
        return
      }
      window.history.pushState({}, '', newUrl)
    }
  }, [mode, allChainIds, debouncedPublicChains, debouncedDirectionalChains])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true

    const params = new URLSearchParams(window.location.search)

    if (mode === 'public') {
      setPublicSelectedChains((current) =>
        parseSelectedChainsQuery(
          params.get('selectedChains') ?? undefined,
          allChainIds,
          interopChains,
          current,
        ),
      )
      return
    }

    setDirectionalSelectedChains({
      from: parseDirectionalSelectionFromQueryValue(
        params.get('from'),
        allChainIds,
      ),
      to: parseDirectionalSelectionFromQueryValue(
        params.get('to'),
        allChainIds,
      ),
    })
  })

  const selectChain = useCallback(
    (index: keyof InteropPublicSelectedChains, chainId: string | null) => {
      if (mode !== 'public') {
        return
      }

      setPublicSelectedChains((prev) => {
        const chain = getInteropSelectedChainFromId(chainId, interopChains)
        if (
          !chain ||
          prev.first?.id === chainId ||
          prev.second?.id === chainId
        ) {
          return prev
        }
        return {
          ...prev,
          [index]: chain,
        }
      })
    },
    [interopChains, mode],
  )

  const toggle = useCallback(
    (type: 'from' | 'to', chainId: string) => {
      if (mode !== 'internal') {
        return
      }

      setDirectionalSelectedChains((prev) => {
        const nextSet = new Set(prev[type])
        if (nextSet.has(chainId)) {
          nextSet.delete(chainId)
        } else {
          nextSet.add(chainId)
        }

        const next = allChainIds.filter((id) => nextSet.has(id))
        return {
          ...prev,
          [type]: next,
        }
      })
    },
    [allChainIds, mode],
  )

  const toggleFrom = useCallback(
    (chainId: string) => {
      toggle('from', chainId)
    },
    [toggle],
  )

  const toggleTo = useCallback(
    (chainId: string) => {
      toggle('to', chainId)
    },
    [toggle],
  )

  const selectAll = useCallback(
    (type?: 'from' | 'to') => {
      if (mode !== 'internal') {
        return
      }

      setDirectionalSelectedChains((prev) => ({
        ...prev,
        ...(type
          ? { [type]: allChainIds }
          : { from: allChainIds, to: allChainIds }),
      }))
    },
    [allChainIds, mode],
  )

  const deselectAll = useCallback(
    (type?: 'from' | 'to') => {
      if (mode !== 'internal') {
        return
      }

      setDirectionalSelectedChains((prev) => ({
        ...prev,
        ...(type ? { [type]: [] } : { from: [], to: [] }),
      }))
    },
    [mode],
  )

  const swapPaths = useCallback(() => {
    if (mode !== 'internal') {
      return
    }

    setDirectionalSelectedChains((prev) => ({
      from: prev.to,
      to: prev.from,
    }))
  }, [mode])

  const reset = useCallback(() => {
    if (mode === 'public') {
      setPublicSelectedChains(defaultPublicSelectedChains)
      return
    }

    setDirectionalSelectedChains({
      from: allChainIds,
      to: allChainIds,
    })
  }, [mode, defaultPublicSelectedChains, allChainIds])

  const isDirty = useMemo(() => {
    if (mode !== 'internal') {
      return false
    }

    return (
      directionalSelectedChains.from.length !== allChainIds.length ||
      directionalSelectedChains.to.length !== allChainIds.length
    )
  }, [mode, directionalSelectedChains, allChainIds])

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        mode,
        selectedChains,
        allChainIds,
        selectChain,
        toggleFrom,
        toggleTo,
        selectAll,
        deselectAll,
        swapPaths,
        reset,
        isDirty,
        apiSelectionInput,
        buildUrl,
      }}
    >
      {children}
    </InteropSelectedChainsContext.Provider>
  )
}

function getInteropSelectedChainFromId(
  id: string | null,
  interopChains: InteropChainWithIcon[],
): InteropSelectedChain | null {
  if (!id) {
    return null
  }
  const interopChain = interopChains.find((c) => c.id === id)
  if (!interopChain) {
    return null
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
  fallback: InteropPublicSelectedChains,
): InteropPublicSelectedChains {
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

function buildDirectionalInteropUrl(
  path: string,
  selectedChains: DirectionalSelectedChains,
  allChainIds: string[],
) {
  const params = new URLSearchParams()

  const fromValue = serializeDirectionalSelectionToQueryValue(
    selectedChains.from,
    allChainIds,
  )
  if (fromValue !== undefined) {
    params.set('from', fromValue)
  }

  const toValue = serializeDirectionalSelectionToQueryValue(
    selectedChains.to,
    allChainIds,
  )
  if (toValue !== undefined) {
    params.set('to', toValue)
  }

  return params.size > 0 ? `${path}?${params.toString()}` : path
}
