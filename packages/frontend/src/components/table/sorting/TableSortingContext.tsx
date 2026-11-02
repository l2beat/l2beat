import type { ColumnSort, SortingState } from '@tanstack/react-table'
import type { Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useQueryState } from '~/hooks/useQueryState'
import { sortingCodec } from '~/utils/queryParamCodecs'

interface TableSortingContextValue {
  sorting: SortingState
  setSorting: Dispatch<SetStateAction<SortingState>>
  defaultSorting: SortingState
}

const TableSortingContext = createContext<TableSortingContextValue | null>(null)

/**
 * Keeps the sorting of the tables inside in the `paramKey` search param.
 * Give every provider on a page its own key, e.g. one per tab.
 */
export function TableSortingProvider({
  children,
  initialSort,
  paramKey,
}: {
  children: React.ReactNode
  initialSort: ColumnSort
  paramKey: string
}) {
  const { id, desc } = initialSort
  const codec = useMemo(() => sortingCodec({ id, desc }), [id, desc])
  const [sorting, setSorting] = useQueryState(paramKey, codec)

  const value = useMemo(
    () => ({ sorting, setSorting, defaultSorting: codec.getDefault() }),
    [sorting, setSorting, codec],
  )

  return (
    <TableSortingContext.Provider value={value}>
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

/** The provider's default, or `undefined` for a table outside a provider. */
export function useDefaultTableSorting(): SortingState | undefined {
  return useContext(TableSortingContext)?.defaultSorting
}
