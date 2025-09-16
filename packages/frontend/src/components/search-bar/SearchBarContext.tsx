import { createContext, useContext, useState } from 'react'
import type { SearchBarProject } from '~/server/features/projects/search-bar/types'
import { SearchBarDialog } from './SearchBarDialog'

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

  return (
    <SearchBarContext.Provider value={{ open, setOpen }}>
      <SearchBarDialog recentlyAdded={recentlyAddedProjects} />
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
