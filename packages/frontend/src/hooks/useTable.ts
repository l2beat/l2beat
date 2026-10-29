import type {
  RowData,
  TableOptions,
  VisibilityState,
} from '@tanstack/react-table'
import { useReactTable } from '@tanstack/react-table'
import { getPersistedColumnsStorageKey } from '~/components/table/persistedColumnVisibility'
import { useIsClient } from './useIsClient'
import { useLocalStorage } from './useLocalStorage'

const ALL_VISIBLE: VisibilityState = {}

export function useTable<TData extends RowData>(
  tableId: string,
  options: TableOptions<TData>,
) {
  // Read after mount so the first client render matches the server.
  const [columnVisibility, setColumnVisibility] = useLocalStorage(
    getPersistedColumnsStorageKey(tableId),
    ALL_VISIBLE,
    { initializeWithValue: false },
  )

  // Flips in the same effect pass that reads storage, so the markup is marked
  // as applied in the very render that removes the columns. Until then the
  // pre-paint script hides them with CSS. See persistedColumnVisibility.ts.
  const isPersistedVisibilityApplied = useIsClient()

  // Caller-controlled visibility takes precedence, so persistence is disabled
  // entirely rather than writing values that would never be read back.
  const isControlled = options.state?.columnVisibility !== undefined

  return useReactTable({
    enableSortingRemoval: false,
    onColumnVisibilityChange: isControlled ? undefined : setColumnVisibility,
    ...options,
    meta: isControlled
      ? options.meta
      : {
          ...options.meta,
          persistedColumns: {
            tableId,
            isApplied: isPersistedVisibilityApplied,
          },
        },
    state: isControlled
      ? options.state
      : { ...options.state, columnVisibility },
    initialState: {
      sorting: [{ id: '#', desc: false }],
      ...options.initialState,
    },
  })
}
