import { useState } from 'react'
import { type Row, rowId } from './rows'

export interface Selection {
  isSelected: (row: Row) => boolean
  toggle: (row: Row) => void
  // Whether the rows in view are selected; toggling selects or clears them.
  all: boolean | 'indeterminate'
  toggleAll: () => void
}

// The selection outlives filter changes, so rows picked under one filter stay
// selected under the next.
export function useRowSelection(rowsInView: Row[]) {
  const [ids, setIds] = useState<ReadonlySet<string>>(new Set())
  const selectedInView = rowsInView.filter((row) => ids.has(rowId(row))).length

  const selection: Selection = {
    isSelected: (row) => ids.has(rowId(row)),
    toggle: (row) =>
      setIds((current) =>
        withChange(current, [rowId(row)], !current.has(rowId(row))),
      ),
    all:
      selectedInView === 0
        ? false
        : selectedInView === rowsInView.length
          ? true
          : 'indeterminate',
    toggleAll: () =>
      setIds((current) =>
        withChange(
          current,
          rowsInView.map(rowId),
          selectedInView < rowsInView.length,
        ),
      ),
  }
  return { ids, selection, clear: () => setIds(new Set()) }
}

function withChange(
  ids: ReadonlySet<string>,
  changed: string[],
  select: boolean,
): ReadonlySet<string> {
  const next = new Set(ids)
  for (const id of changed) {
    if (select) next.add(id)
    else next.delete(id)
  }
  return next
}
