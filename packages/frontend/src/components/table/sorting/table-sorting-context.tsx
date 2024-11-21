'use client'

import { type ColumnDef, type SortingState } from '@tanstack/react-table'
import {
  type Dispatch,
  type SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'

const TableSortingContext = createContext<{
  sorting: SortingState
  setSorting: Dispatch<SetStateAction<SortingState>>
} | null>(null)

export function TableSortingProvider({
  children,
}: { children: React.ReactNode }) {
  const [sorting, setSorting] = useState<SortingState>([])

  return (
    <TableSortingContext.Provider value={{ sorting, setSorting }}>
      {children}
    </TableSortingContext.Provider>
  )
}

export function useTableSorting<T>({
  initialSort,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: { initialSort: SortingState; columns: ColumnDef<T, any>[] }) {
  const context = useContext(TableSortingContext)
  if (!context) {
    throw new Error(
      'useTableSorting must be used within a TableSortingProvider',
    )
  }

  const memoized = useMemo(
    () => ({
      ...context,
      sorting: context.sorting.length > 0 ? context.sorting : initialSort,
    }),
    [context, initialSort],
  )

  return memoized
}
