import type { Row } from '@tanstack/react-table'

export function applyBasicTableRowSorting<T>(
  rows: Row<T>[],
  rowSortingFn: ((a: Row<T>, b: Row<T>) => number) | undefined,
) {
  if (rowSortingFn !== undefined) {
    rows.sort((a, b) => rowSortingFn(a, b))
  }
  return rows
}
