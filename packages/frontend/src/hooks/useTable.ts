import type {
  RowData,
  TableOptions,
  VisibilityState,
} from '@tanstack/react-table'
import { useReactTable } from '@tanstack/react-table'
import { useLocalStorage } from './useLocalStorage'

const ALL_VISIBLE: VisibilityState = {}

export function useTable<TData extends RowData>(
  tableId: string,
  options: TableOptions<TData>,
) {
  // Read after mount so the first client render matches the server.
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    `table-column-visibility-${tableId}`,
    ALL_VISIBLE,
    { initializeWithValue: false },
  )

  // Caller-controlled visibility takes precedence, so persistence is disabled
  // entirely rather than writing values that would never be read back.
  const isControlled = options.state?.columnVisibility !== undefined

  return useReactTable({
    enableSortingRemoval: false,
    onColumnVisibilityChange: isControlled ? undefined : setColumnVisibility,
    ...options,
    state: isControlled
      ? options.state
      : { ...options.state, columnVisibility },
    initialState: {
      sorting: [{ id: '#', desc: false }],
      ...options.initialState,
    },
  })
}
