'use client'

import { createContext, useContext } from 'react'
import { useFilterState } from './use-filter-state'

type NewTableFilterContextValue = ReturnType<typeof useFilterState>

const NewTableFilterContext = createContext<NewTableFilterContextValue | null>(
  null,
)

interface Props {
  children: React.ReactNode
}

export function NewTableFilterContextProvider({ children }: Props) {
  const { state, dispatch } = useFilterState()

  return (
    <NewTableFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </NewTableFilterContext.Provider>
  )
}

export function useNewTableFilterContext() {
  const context = useContext(NewTableFilterContext)
  if (!context) {
    throw new Error(
      'useNewTableFilterContext must be used within a NewTableFilterContextProvider',
    )
  }
  return context
}
