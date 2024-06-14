import {
  type RowData,
  type TableOptions,
  useReactTable,
} from '@tanstack/react-table'

export function useTable<TData extends RowData>(options: TableOptions<TData>) {
  return useReactTable({
    enableSortingRemoval: false,
    sortDescFirst: true,
    initialState: {
      sorting: [{ id: '#', desc: false }],
    },
    ...options,
  })
}
