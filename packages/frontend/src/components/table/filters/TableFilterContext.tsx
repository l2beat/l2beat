import { createContext, useContext } from 'react'
import { useFilterState } from './UseFilterState'

type TableFilterContextValue = ReturnType<typeof useFilterState>

const TableFilterContext = createContext<TableFilterContextValue | null>(null)

interface Props {
  children: React.ReactNode
}

export function TableFilterContextProvider({ children }: Props) {
  const { state, dispatch } = useFilterState()

  return (
    <TableFilterContext.Provider value={{ state, dispatch }}>
      {children}
    </TableFilterContext.Provider>
  )
}

export function useTableFilterContext() {
  const context = useContext(TableFilterContext)
  if (!context) {
    throw new Error(
      'useTableFilterContext must be used within a TableFilterContextProvider',
    )
  }
  return context
}

export function useTableFilterReset() {
  const context = useContext(TableFilterContext)

  const reset = () => {
    context?.dispatch({ type: 'clear' })
  }

  return reset
}
