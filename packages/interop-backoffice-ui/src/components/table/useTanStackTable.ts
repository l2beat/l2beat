import {
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowData,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import fuzzysort from 'fuzzysort'
import { useEffect, useMemo, useState } from 'react'
import { useDebouncedValue } from '~/hooks/useDebouncedValue'

export type PageSizeOption = '10' | '25' | '50' | '100' | 'all'

function toPageSize(option: PageSizeOption, rowsCount: number) {
  if (option === 'all') {
    return Math.max(rowsCount, 1)
  }
  return Number(option)
}

function stringifyFuzzySearchValue(value: unknown): string {
  if (value === undefined || value === null) {
    return ''
  }

  if (Array.isArray(value)) {
    return value.map(stringifyFuzzySearchValue).filter(Boolean).join(' ')
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    return String(value)
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function getValueByAccessorKey(row: unknown, accessorKey: string) {
  let current = row

  for (const part of accessorKey.split('.')) {
    if (
      current === null ||
      current === undefined ||
      typeof current !== 'object'
    ) {
      return undefined
    }

    current = (current as Record<string, unknown>)[part]
  }

  return current
}

function getAccessorValue<TData extends RowData, TValue>(
  column: ColumnDef<TData, TValue>,
  row: TData,
  rowIndex: number,
): TValue | undefined {
  if ('accessorFn' in column && typeof column.accessorFn === 'function') {
    return column.accessorFn(row, rowIndex)
  }

  if ('accessorKey' in column && typeof column.accessorKey === 'string') {
    return getValueByAccessorKey(row, column.accessorKey) as TValue | undefined
  }

  return undefined
}

function getLeafColumns<TData extends RowData>(
  columns: ColumnDef<TData, unknown>[],
): ColumnDef<TData, unknown>[] {
  return columns.flatMap((column) => {
    if ('columns' in column && Array.isArray(column.columns)) {
      return getLeafColumns(column.columns)
    }

    return [column]
  })
}

function getSearchableColumns<TData extends RowData>(
  columns: ColumnDef<TData, unknown>[],
) {
  return getLeafColumns(columns).flatMap((column) => {
    const isSearchable =
      column.meta?.fuzzySearch === true ||
      column.meta?.getFuzzySearchValue !== undefined

    if (!isSearchable) {
      return []
    }

    return [
      (row: TData, rowIndex: number) => {
        const accessorValue = getAccessorValue(column, row, rowIndex)
        const fuzzySearchValue =
          column.meta?.getFuzzySearchValue?.({
            row,
            value: accessorValue,
            rowIndex,
          }) ?? accessorValue

        return stringifyFuzzySearchValue(fuzzySearchValue)
      },
    ]
  })
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
  const searchableColumns = useMemo(
    () => getSearchableColumns(columns),
    [columns],
  )

  const preparedRows = useMemo(() => {
    return data.map((row, rowIndex) => ({
      row,
      searchTarget: fuzzysort.prepare(
        searchableColumns
          .map((getSearchText) => getSearchText(row, rowIndex))
          .filter((value) => value.length > 0)
          .join(' '),
      ),
    }))
  }, [data, searchableColumns])

  const filteredData = useMemo(() => {
    if (debouncedSearchValue === '' || searchableColumns.length === 0) {
      return data
    }

    return fuzzysort
      .go(debouncedSearchValue, preparedRows, {
        key: 'searchTarget',
        limit: preparedRows.length,
        threshold: 0.3,
      })
      .map((result) => result.obj.row)
  }, [data, debouncedSearchValue, preparedRows, searchableColumns.length])

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
    isFuzzySearchEnabled: searchableColumns.length > 0,
    isSearchPending: searchValue.trim() !== debouncedSearchValue,
    filteredRowsCount: filteredData.length,
    searchPlaceholder,
    searchValue,
    setSearchValue,
    totalRowsCount: data.length,
  }
}
