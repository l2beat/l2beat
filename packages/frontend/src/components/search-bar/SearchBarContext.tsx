import { createContext, useContext, useState } from 'react'
import type { SearchBarProject } from '~/server/features/search-bar/types'
import { SearchBarDialog } from './SearchBarDialog'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  openWithQuery: (query: string) => void
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
  // A new key remounts the dialog, so its input starts from the query even
  // when it was opened with the same one before and then edited.
  const [prefill, setPrefill] = useState({ key: 0, query: '' })

  function openWithQuery(query: string) {
    setPrefill(({ key }) => ({ key: key + 1, query }))
    setOpen(true)
  }

  return (
    <SearchBarContext.Provider value={{ open, setOpen, openWithQuery }}>
      <SearchBarDialog
        key={prefill.key}
        initialQuery={prefill.query}
        recentlyAdded={recentlyAddedProjects}
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
