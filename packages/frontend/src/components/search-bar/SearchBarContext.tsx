import { createContext, useContext, useState } from 'react'
import { useGlobalShortcut } from '~/hooks/useGlobalShortcut'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { ClosedSearchBarDialog, SearchBarDialog } from './SearchBarDialog'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

interface Props {
  children: React.ReactNode
  recentlyAddedProjects: SearchBarProject[]
}

export function SearchBarContextProvider({
  children,
  recentlyAddedProjects,
}: Props) {
  const [open, setOpen] = useState(false)
  const [hasOpened, setHasOpened] = useState(false)
  if (open && !hasOpened) setHasOpened(true)

  useGlobalShortcut('/', () => setOpen((open) => !open))

  return (
    <SearchBarContext.Provider value={{ open, setOpen }}>
      {hasOpened ? (
        <SearchBarDialog recentlyAdded={recentlyAddedProjects} />
      ) : (
        <ClosedSearchBarDialog />
      )}
      {children}
    </SearchBarContext.Provider>
  )
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
