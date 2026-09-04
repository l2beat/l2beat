import type { Cell, Header } from '@tanstack/react-table'

/** TanStack columns that BasicTable does not render. */
export function isChangeSortColumn(column: {
  columnDef: { meta?: { isChangeSortColumn?: boolean } }
}): boolean {
  return column.columnDef.meta?.isChangeSortColumn === true
}

export function getRenderedColSpan<TData, TValue>(
  header: Header<TData, TValue>,
): number {
  return header.column
    .getLeafColumns()
    .filter((column) => column.getIsVisible() && !isChangeSortColumn(column))
    .length
}

export function getRenderedHeaders<TData, TValue>(
  headers: Header<TData, TValue>[],
) {
  return headers.filter((header) => getRenderedColSpan(header) > 0)
}

export function getRenderedCells<TData, TValue>(cells: Cell<TData, TValue>[]) {
  return cells.filter((cell) => !isChangeSortColumn(cell.column))
}
