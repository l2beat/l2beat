import type { RowData, TableOptions } from '@tanstack/react-table'
import { useReactTable } from '@tanstack/react-table'
import { getChangeSortColumnVisibility } from '~/components/table/sorting/changeSortColumn'

export function useTable<TData extends RowData>(options: TableOptions<TData>) {
  return useReactTable({
    enableSortingRemoval: false,
    ...options,
    initialState: {
      sorting: [{ id: '#', desc: false }],
      ...options.initialState,
      columnVisibility: {
        ...getChangeSortColumnVisibility(options.columns),
        ...options.initialState?.columnVisibility,
      },
    },
  })
}
