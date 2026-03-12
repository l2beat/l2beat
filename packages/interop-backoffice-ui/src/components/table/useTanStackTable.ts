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
}

export function useTanStackTable<TData extends RowData>({
  data,
  columns,
  getRowId,
  initialSorting = [],
  initialPageSizeOption = '25',
}: UseTanStackTableOptions<TData>) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting)
  const [pageSizeOption, setPageSizeOption] = useState<PageSizeOption>(
    initialPageSizeOption,
  )

  const table = useReactTable({
    data,
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
    const nextPageSize = toPageSize(pageSizeOption, data.length)
    const currentPageSize = table.getState().pagination.pageSize
    if (currentPageSize !== nextPageSize) {
      table.setPageSize(nextPageSize)
      table.setPageIndex(0)
    }
  }, [pageSizeOption, data.length, table])

  return {
    table,
    pageSizeOption,
    setPageSizeOption,
  }
}
