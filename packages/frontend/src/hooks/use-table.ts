import type { RowData, TableOptions } from '@tanstack/react-table'
import { useReactTable } from '@tanstack/react-table'

export function useTable<TData extends RowData>(options: TableOptions<TData>) {
  return useReactTable({
    enableSortingRemoval: false,
    initialState: {
      sorting: [{ id: '#', desc: false }],
    },
    ...options,
  })
}
