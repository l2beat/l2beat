import type {
  RowData,
  TableOptions,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import { functionalUpdate, useReactTable } from '@tanstack/react-table'
import { useCallback, useMemo } from 'react'
import { useLocalStorage } from './useLocalStorage'

const NO_HIDDEN_COLUMNS: string[] = []

const STORAGE_OPTIONS = {
  initializeWithValue: false,
  deserializer: parseHiddenColumns,
}

export function useTable<TData extends RowData>(
  tableId: string,
  options: TableOptions<TData>,
) {
  const [hiddenColumns, setHiddenColumns] = useLocalStorage(
    `table-hidden-columns-${tableId}`,
    NO_HIDDEN_COLUMNS,
    STORAGE_OPTIONS,
  )

  const columnVisibility = useMemo(
    () => toVisibilityState(hiddenColumns),
    [hiddenColumns],
  )

  const onColumnVisibilityChange = useCallback(
    (updater: Updater<VisibilityState>) => {
      setHiddenColumns((previous) =>
        toHiddenColumns(functionalUpdate(updater, toVisibilityState(previous))),
      )
    },
    [setHiddenColumns],
  )

  return useReactTable({
    enableSortingRemoval: false,
    onColumnVisibilityChange,
    ...options,
    state: {
      columnVisibility,
      ...options.state,
    },
    initialState: {
      sorting: [{ id: '#', desc: false }],
      ...options.initialState,
    },
  })
}

export function parseHiddenColumns(raw: string): string[] {
  try {
    const parsed: unknown = JSON.parse(raw)
    if (
      Array.isArray(parsed) &&
      parsed.every((id) => typeof id === 'string')
    ) {
      return parsed
    }
  } catch {
    // fall through
  }
  return NO_HIDDEN_COLUMNS
}

export function toVisibilityState(hiddenColumns: string[]): VisibilityState {
  return Object.fromEntries(hiddenColumns.map((id) => [id, false]))
}

export function toHiddenColumns(visibility: VisibilityState): string[] {
  return Object.keys(visibility).filter((id) => visibility[id] === false)
}
