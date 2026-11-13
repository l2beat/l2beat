import { createContext, useContext, useState } from 'react'
import { SearchBarDialog } from './SearchBarDialog'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

export function SearchBarContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <SearchBarContext.Provider value={{ open, setOpen }}>
      <SearchBarDialog />
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
