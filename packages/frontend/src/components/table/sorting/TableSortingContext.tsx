import type { ColumnSort, SortingState } from '@tanstack/react-table'
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

const TableSortingContext = createContext<{
  sorting: SortingState
  setSorting: Dispatch<SetStateAction<SortingState>>
} | null>(null)

export function TableSortingProvider({
  children,
  initialSort,
}: {
  children: React.ReactNode
  initialSort: ColumnSort
}) {
  const [sorting, setSorting] = useState<SortingState>([initialSort])

  return (
    <TableSortingContext.Provider value={{ sorting, setSorting }}>
      {children}
    </TableSortingContext.Provider>
  )
}

export function useTableSorting() {
  const context = useContext(TableSortingContext)
  if (!context) {
    throw new Error(
      'useTableSorting must be used within a TableSortingProvider',
    )
  }

  return context
}
