import {
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type OnChangeFn,
  type Row,
  type RowData,
  type RowSelectionState,
  type SortingState,
  type TableOptions,
  useReactTable,
} from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'
import { scalarSelectFilter, withFilterDefaults } from './filter/filters'
import { useTableSearch } from './hooks/useTableSearch'
import { fuzzyFilter } from './search'

export type PageSizeOption = '10' | '25' | '50' | '100' | 'all'

function toPageSize(option: PageSizeOption, rowsCount: number) {
  if (option === 'all') {
    return Math.max(rowsCount, 1)
  }
  return Number(option)
}

interface UseTanStackTableOptions<TData extends RowData> {
  data: TData[]
  columns: TableOptions<TData>['columns']
  getRowId?: (row: TData, index: number) => string
  initialSorting?: SortingState
  initialColumnFilters?: ColumnFiltersState
  initialPageSizeOption?: PageSizeOption
  searchPlaceholder?: string
  rowSelection?: RowSelectionState
  onRowSelectionChange?: OnChangeFn<RowSelectionState>
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean)
}

export function useTanStackTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  initialSorting = [],
  initialColumnFilters = [],
  initialPageSizeOption = '100',
  searchPlaceholder = 'Search',
  rowSelection,
  onRowSelectionChange,
  enableRowSelection,
}: UseTanStackTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters)
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>(
    initialPageSizeOption,
  )
  const { isSearchPending, globalFilter, searchValue, setSearchValue } =
    useTableSearch()

  const resolvedColumns = useMemo(() => withFilterDefaults(columns), [columns])

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    sortDescFirst: true,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      ...(rowSelection ? { rowSelection } : {}),
    },
    filterFns: {
      fuzzy: fuzzyFilter,
      scalarSelect: scalarSelectFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    initialState: {
      sorting: initialSorting,
      columnFilters: initialColumnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: toPageSize(initialPageSizeOption, data.length),
      },
    },
    getRowId,
    enableRowSelection,
  })
  const filteredRowsCount = table.getFilteredRowModel().rows.length

  useEffect(() => {
    const nextPageSize = toPageSize(pageSizeOption, filteredRowsCount)
    const currentPageSize = table.getState().pagination.pageSize
    if (currentPageSize !== nextPageSize) {
      table.setPageSize(nextPageSize)
      table.setPageIndex(0)
    }
  }, [pageSizeOption, filteredRowsCount, table])

  return {
    table,

    pageSizeOption,
    setPageSizeOption,

    searchValue,
    setSearchValue,
    searchPlaceholder,
    isSearchPending,
    isSearchEnabled: table
      .getAllColumns()
      .some((col) => col.getCanGlobalFilter()),

    columnFilters,
    setColumnFilters,

    filteredRowsCount,
    totalRowsCount: data.length,
  }
}
