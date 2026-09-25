import {
  buildHeaderGroups,
  type Cell,
  type Column,
  type Header,
  type Row,
  type Table,
} from '@tanstack/react-table'

/*
 * Columns hidden in the column picker stay in the markup, hidden with CSS, so
 * every row is complete for crawlers and the DOM does not depend on
 * per-visitor state. "Rendered" means present in the markup; "shown" means
 * rendered and visible.
 */

/** TanStack columns that BasicTable does not render. */
export function isChangeSortColumn(column: {
  columnDef: { meta?: { isChangeSortColumn?: boolean } }
}): boolean {
  return column.columnDef.meta?.isChangeSortColumn === true
}

/**
 * TanStack's `getHeaderGroups` drops hidden columns, so the groups are rebuilt
 * from every leaf column in the same left, center, right pinning order.
 */
export function getHeaderGroupsWithHiddenColumns<TData>(table: Table<TData>) {
  return buildHeaderGroups(
    table.getAllColumns(),
    getLeafColumnsInPinnedOrder(table),
    table,
  )
}

/** Cells of every leaf column, hidden ones included, in header order. */
export function getRenderedCellsWithHiddenColumns<TData>(
  row: Row<TData>,
  table: Table<TData>,
) {
  const cellsByColumnId = new Map(
    row.getAllCells().map((cell) => [cell.column.id, cell]),
  )
  const cells = getLeafColumnsInPinnedOrder(table).flatMap((column) => {
    const cell = cellsByColumnId.get(column.id)
    return cell ? [cell] : []
  })
  return getRenderedCells(cells)
}

/** Hidden columns are rendered too; this says whether a column takes space. */
export function isShownColumn<TData>(column: Column<TData, unknown>) {
  return column.getIsVisible()
}

/** Only shown columns count, since hidden cells take no space in the layout. */
export function getRenderedColSpan<TData, TValue>(
  header: Header<TData, TValue>,
): number {
  return getRenderedLeafColumns(header).filter(isShownColumn).length
}

export function isShownHeader<TData, TValue>(header: Header<TData, TValue>) {
  return getRenderedLeafColumns(header).some(isShownColumn)
}

export function getRenderedHeaders<TData, TValue>(
  headers: Header<TData, TValue>[],
) {
  return headers.filter((header) => getRenderedLeafColumns(header).length > 0)
}

export function getShownHeaders<TData, TValue>(
  headers: Header<TData, TValue>[],
) {
  return headers.filter(isShownHeader)
}

export function getRenderedCells<TData, TValue>(cells: Cell<TData, TValue>[]) {
  return cells.filter((cell) => !isChangeSortColumn(cell.column))
}

export type ShownEdgeAttributes = {
  'data-first-shown'?: ''
  'data-last-shown'?: ''
}

/**
 * `first:` and `last:` padding counts hidden cells as siblings, so the shown
 * cells at the row's edges are marked for the `data-*-shown:` variants. Marks
 * are only added when a hidden cell sits beyond the edge, which keeps the
 * markup of tables without hidden columns unchanged.
 */
export function getShownEdgeAttributes(
  isShown: boolean[],
): ShownEdgeAttributes[] {
  const firstShown = isShown.indexOf(true)
  const lastShown = isShown.lastIndexOf(true)
  return isShown.map((_, index) => ({
    'data-first-shown': index === firstShown && index > 0 ? '' : undefined,
    'data-last-shown':
      index === lastShown && index < isShown.length - 1 ? '' : undefined,
  }))
}

function getRenderedLeafColumns<TData, TValue>(header: Header<TData, TValue>) {
  return header.column
    .getLeafColumns()
    .filter((column) => !isChangeSortColumn(column))
}

function getLeafColumnsInPinnedOrder<TData>(
  table: Table<TData>,
): Column<TData, unknown>[] {
  return [
    ...table.getLeftLeafColumns(),
    ...table.getCenterLeafColumns(),
    ...table.getRightLeafColumns(),
  ]
}
