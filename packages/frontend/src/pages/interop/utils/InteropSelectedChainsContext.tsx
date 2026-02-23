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
import type { InteropSelectionInput } from '~/server/features/scaling/interop/types'
import type { InteropChainWithIcon } from '../components/chain-selector/types'
import { buildInteropUrl } from './buildInteropUrl'
import {
  getInitialInteropSelection,
  type InteropSelection,
} from './getInitialInteropSelection'
import { normalizeMultiChainSelection } from './multiChainSelection'

export type InteropMode = 'public' | 'internal'

interface InteropSelectedChainsContextType {
  mode: InteropMode
  selectedChains: InteropSelection
  allChainIds: string[]
  getChainById: (chainId: string) => InteropChainWithIcon | undefined
  selectChain: (type: 'from' | 'to', chainId: string | null) => void
  toggleFrom: (chainId: string) => void
  toggleTo: (chainId: string) => void
  selectAll: (type?: 'from' | 'to') => void
  deselectAll: (type?: 'from' | 'to') => void
  swapPaths: () => void
  reset: () => void
  isDirty: boolean
  apiSelectionInput: InteropSelectionInput
  buildUrl: (path: string, options?: { mode?: InteropMode }) => string
}

export const InteropSelectedChainsContext = createContext<
  InteropSelectedChainsContextType | undefined
>(undefined)

interface InteropSelectedChainsProviderProps {
  children: ReactNode
  mode: InteropMode
  interopChains: InteropChainWithIcon[]
  initialSelection: InteropSelection
}

export function InteropSelectedChainsProvider({
  children,
  mode,
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

  const defaultSelectionByMode = useMemo(
    () => ({
      public: {
        from: [],
        to: [],
      },
      internal: {
        from: [...allChainIds],
        to: [...allChainIds],
      },
    }),
    [allChainIds],
  )

  const normalizedInitialSelection = useMemo(
    () =>
      normalizeSelection(
        initialSelection,
        allChainIds,
        defaultSelectionByMode[mode],
      ),
    [initialSelection, allChainIds, defaultSelectionByMode, mode],
  )

  const [selection, setSelection] = useState(normalizedInitialSelection)

  useEffect(() => {
    setSelection(normalizedInitialSelection)
  }, [normalizedInitialSelection])

  const getChainById = useCallback(
    (chainId: string) => chainsById.get(chainId),
    [chainsById],
  )

  const apiSelectionInput = useMemo(
    (): InteropSelectionInput => ({
      from: selection.from,
      to: selection.to,
    }),
    [selection],
  )

  const buildUrl = useCallback(
    (path: string, options?: { mode?: InteropMode }) => {
      const targetMode = options?.mode ?? mode
      const targetPath = toInteropPathMode(path, targetMode)
      return buildInteropUrl(
        targetPath,
        selection,
        allChainIds,
        defaultSelectionByMode[targetMode],
      )
    },
    [mode, selection, allChainIds, defaultSelectionByMode],
  )

  const debouncedSelection = useDebouncedValue(selection, 500)
  const skipNextUrlUpdate = useRef(false)

  useEffect(() => {
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false
      return
    }

    const nextUrl = buildInteropUrl(
      toInteropPathMode(window.location.pathname, mode),
      debouncedSelection,
      allChainIds,
      defaultSelectionByMode[mode],
    )

    const currentUrl = window.location.pathname + window.location.search
    if (nextUrl === currentUrl) {
      return
    }

    if (window.location.search === '') {
      window.history.replaceState({}, '', nextUrl)
      return
    }

    window.history.pushState({}, '', nextUrl)
  }, [debouncedSelection, mode, allChainIds, defaultSelectionByMode])

  useEventListener('popstate', () => {
    skipNextUrlUpdate.current = true

    const params = new URLSearchParams(window.location.search)
    const fallback = mode === 'internal' ? 'all' : 'empty'
    const parsedSelection = getInitialInteropSelection({
      query: {
        from: parseQueryArray(params.get('from')),
        to: parseQueryArray(params.get('to')),
      },
      interopChainsIds: allChainIds,
      fallback,
    })

    setSelection(
      normalizeSelection(
        parsedSelection,
        allChainIds,
        defaultSelectionByMode[mode],
      ),
    )
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

  const reset = useCallback(() => {
    setSelection(defaultSelectionByMode[mode])
  }, [defaultSelectionByMode, mode])

  const isDirty = useMemo(
    () =>
      !isSameSelection(selection.from, defaultSelectionByMode[mode].from) ||
      !isSameSelection(selection.to, defaultSelectionByMode[mode].to),
    [selection, defaultSelectionByMode, mode],
  )

  return (
    <InteropSelectedChainsContext.Provider
      value={{
        mode,
        selectedChains: selection,
        allChainIds,
        getChainById,
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

function normalizeSelection(
  selection: InteropSelection,
  allChainIds: string[],
  defaultSelection: InteropSelection,
): InteropSelection {
  return {
    from: normalizeMultiChainSelection(
      selection.from,
      allChainIds,
      getFallbackFromDefault(defaultSelection.from, allChainIds),
    ),
    to: normalizeMultiChainSelection(
      selection.to,
      allChainIds,
      getFallbackFromDefault(defaultSelection.to, allChainIds),
    ),
  }
}

function getFallbackFromDefault(
  defaultSelection: string[],
  allChainIds: string[],
): 'all' | 'empty' {
  return isSameSelection(defaultSelection, allChainIds) ? 'all' : 'empty'
}

function toggleSelection(
  selection: string[],
  chainId: string,
  allChainIds: string[],
): string[] {
  const nextSet = new Set(selection)
  if (nextSet.has(chainId)) {
    nextSet.delete(chainId)
  } else {
    nextSet.add(chainId)
  }

  return allChainIds.filter((id) => nextSet.has(id))
}

function parseQueryArray(value: string | null) {
  if (value === null) {
    return undefined
  }

  return value.split(',')
}

function toInteropPathMode(path: string, mode: InteropMode) {
  const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path

  if (mode === 'internal') {
    if (normalizedPath.endsWith('/internal')) {
      return normalizedPath
    }
    return `${normalizedPath}/internal`
  }

  if (normalizedPath.endsWith('/internal')) {
    return normalizedPath.slice(0, -'/internal'.length)
  }

  return normalizedPath
}

function isSameSelection(left: string[], right: string[]) {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
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
