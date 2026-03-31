import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useState } from 'react'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'
import { useTableSearch } from './search'

export type PageSizeOption = '10' | '25' | '50' | '100' | 'all'

function toPageSize(option: PageSizeOption, rowsCount: number) {
  if (option === 'all') {
    return Math.max(rowsCount, 1)
  }
  return Number(option)
}

interface UseTanStackTableOptions<TData extends RowData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  getRowId?: (row: TData, index: number) => string
  initialSorting?: SortingState
  initialPageSizeOption?: PageSizeOption
  searchPlaceholder?: string
}

export function useTanStackTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  initialSorting = [],
  initialPageSizeOption = '100',
  searchPlaceholder = 'Fuzzy search',
}: UseTanStackTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>(
    initialPageSizeOption,
  )
  const [searchValue, setSearchValue] = useState('')
  const debouncedSearchValue = useDebouncedValue(searchValue.trim(), 150)
  const { filteredData, hasAnySearchableColumns } = useTableSearch({
    data,
    columns,
    searchValue: debouncedSearchValue,
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      sorting: initialSorting,
      pagination: {
        pageIndex: 0,
        pageSize: toPageSize(initialPageSizeOption, data.length),
      },
    },
    getRowId,
  })

  useEffect(() => {
    const nextPageSize = toPageSize(pageSizeOption, filteredData.length)
    const currentPageSize = table.getState().pagination.pageSize
    if (currentPageSize !== nextPageSize) {
      table.setPageSize(nextPageSize)
      table.setPageIndex(0)
    }
  }, [pageSizeOption, filteredData.length, table])

  return {
    table,
    pageSizeOption,
    setPageSizeOption,
    isSearchEnabled: hasAnySearchableColumns,
    isSearchPending: searchValue.trim() !== debouncedSearchValue,
    filteredRowsCount: filteredData.length,
    searchPlaceholder,
    searchValue,
    setSearchValue,
    totalRowsCount: data.length,
  }
}
