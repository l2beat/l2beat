import { assert } from '@l2beat/shared-pure'
import type { ColumnDef, ColumnHelper, Header } from '@tanstack/react-table'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'

const CHANGE_SORT_HEADERS: Record<PercentageChangePeriod, string> = {
  '1D': '1D',
  '7D': '7D',
  last24h: '24H',
  last30d: '30D',
}

/**
 * Pairs a value column with a companion used only to sort by percentage
 * change. The companion is not a table column: BasicTable never renders it,
 * and enableHiding: false keeps it out of the column picker.
 */
export function withChangeSort<TData, TValue>(
  columnHelper: ColumnHelper<TData>,
  column: ColumnDef<TData, TValue>,
  opts: {
    getChange: (row: TData) => number | undefined
    period: PercentageChangePeriod
  },
): [ColumnDef<TData, TValue>, ColumnDef<TData, number | undefined>] {
  const id = column.id
  assert(id, 'withChangeSort requires the value column to have an id')
  const changeId = `${id}Change`

  return [
    {
      ...column,
      meta: {
        ...column.meta,
        changeSortColumnId: changeId,
      },
    },
    columnHelper.accessor(opts.getChange, {
      id: changeId,
      header: CHANGE_SORT_HEADERS[opts.period],
      sortUndefined: 'last',
      sortDescFirst: true,
      enableHiding: false,
      meta: {
        isChangeSortColumn: true,
      },
    }),
  ]
}

export function isChangeSortColumn(column: {
  columnDef: { meta?: { isChangeSortColumn?: boolean } }
}): boolean {
  return column.columnDef.meta?.isChangeSortColumn === true
}

/** Leaf count for layout, excluding sort-only companion columns. */
export function getChangeSortAwareColSpan<TData, TValue>(
  header: Header<TData, TValue>,
): number {
  return header.column
    .getLeafColumns()
    .filter((column) => column.getIsVisible() && !isChangeSortColumn(column))
    .length
}
