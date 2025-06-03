import { createContext, useContext, useState } from 'react'
import { useIsMobile } from '~/hooks/useIsMobile'
import { SearchBarDialog } from './SearchBarDialog'
import type { SearchBarProject } from './SearchBarEntry'

type SearchBarContextValue = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const SearchBarContext = createContext<SearchBarContextValue | null>(null)

interface Props {
  children: React.ReactNode
  projects: SearchBarProject[]
}

export function SearchBarContextProvider({ children, projects }: Props) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const recentlyAdded = [...projects]
    .filter((p) => !p.isUpcoming)
    .sort((a, b) => b.addedAt - a.addedAt)
    .slice(0, isMobile ? 15 : 5)

  return (
    <SearchBarContext.Provider value={{ open, setOpen }}>
      <SearchBarDialog recentlyAdded={recentlyAdded} allProjects={projects} />
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
