import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useState } from 'react'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { SearchBarDialog } from './SearchBarDialog'
import { searchIndexQueryOptions } from './useSearchBarResults'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

interface Props {
  children: React.ReactNode
  recentlyAddedProjects: SearchBarProject[]
  searchIndexPath: string
}

export function SearchBarContextProvider({
  children,
  recentlyAddedProjects,
  searchIndexPath,
}: Props) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Fetched ahead, so the first search already has it. The browser caches it
  // across pages, so later pages read it from disk.
  useEffect(() => {
    return onIdle(() => {
      void queryClient.prefetchQuery(searchIndexQueryOptions(searchIndexPath))
    })
  }, [queryClient, searchIndexPath])

  return (
    <SearchBarContext.Provider value={{ open, setOpen }}>
      <SearchBarDialog
        recentlyAdded={recentlyAddedProjects}
        searchIndexPath={searchIndexPath}
      />
      {children}
    </SearchBarContext.Provider>
  )
}

const IDLE_TIMEOUT_MS = 5_000

/** Safari has no `requestIdleCallback`, so it waits the timeout instead. */
function onIdle(callback: () => void): () => void {
  if (typeof window.requestIdleCallback === 'function') {
    const handle = window.requestIdleCallback(callback, {
      timeout: IDLE_TIMEOUT_MS,
    })
    return () => window.cancelIdleCallback(handle)
  }
  const handle = window.setTimeout(callback, IDLE_TIMEOUT_MS)
  return () => window.clearTimeout(handle)
}

export function useSearchBarContext() {
  const context = useContext(SearchBarContext)
  if (!context) {
    throw new Error(
      'useSearchBarContext must be used within a SearchBarContextProvider',
    )
  }
  return context
}
