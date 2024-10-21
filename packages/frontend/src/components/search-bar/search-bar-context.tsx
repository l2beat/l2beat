'use client'

import { createContext, useContext, useState } from 'react'
import { SearchBarDialog } from './search-bar-dialog'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

interface Props {
  children: React.ReactNode
  recentlyAdded: SearchBarProject[]
  allProjects: SearchBarProject[]
}

export interface SearchBarProject {
  id: string
  name: string
  iconUrl: string
  href: string
  matchers: string[]
}

export function SearchBarContextProvider({
  children,
  recentlyAdded,
  allProjects,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <SearchBarContext.Provider value={{ open, setOpen }}>
      <SearchBarDialog
        recentlyAdded={recentlyAdded}
        allProjects={allProjects}
      />
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
