import {
  functionalUpdate,
  type OnChangeFn,
  type SortingState,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'
import type { InteropTransfersSort } from '~/server/features/layer2s/interop/types'

const DEFAULT_SORT: InteropTransfersSort = { by: 'timestamp', desc: true }

/**
 * Sorting for a transfers table. The server sorts, because the table only
 * ever holds the pages loaded so far: `sort` goes into the query and
 * `tableOptions` into the table.
 */
export function useTransfersSorting({
  onChange,
}: {
  /** Called when the user picks another order, e.g. to go back to page one. */
  onChange?: () => void
} = {}) {
  const [sort, setSort] = useState(DEFAULT_SORT)
  const sorting = useMemo<SortingState>(
    () => [{ id: sort.by, desc: sort.desc }],
    [sort],
  )

  const onSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = functionalUpdate(updater, sorting)[0]
    setSort(
      next
        ? { by: next.id as InteropTransfersSort['by'], desc: next.desc }
        : DEFAULT_SORT,
    )
    onChange?.()
  }

  return {
    sort,
    sorting,
    tableOptions: {
      manualSorting: true,
      // One order at a time: the server takes a single sort.
      enableMultiSort: false,
      onSortingChange,
    },
  }
}
