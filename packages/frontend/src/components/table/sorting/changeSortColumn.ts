import { assert } from '@l2beat/shared-pure'
import type { ColumnDef, ColumnHelper } from '@tanstack/react-table'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'

const CHANGE_SORT_HEADERS: Record<PercentageChangePeriod, string> = {
  '1D': '1d',
  '7D': '7d',
  last24h: '24h',
  last7d: '7d',
  last30d: '30d',
}

/**
 * Pairs a value column with a TanStack companion used only to sort by
 * percentage change. BasicTable does not render the companion;
 * enableHiding: false keeps it out of the column picker.
 */
export function withChangeSort<TData, TValue>(
  columnHelper: ColumnHelper<TData>,
  column: ColumnDef<TData, TValue>,
  getChange: (row: TData) => {
    change: number | undefined
    period: PercentageChangePeriod | undefined
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
    columnHelper.accessor((row) => getChange(row).change, {
      id: changeId,
      header: ({ table }) => {
        for (const row of table.getCoreRowModel().rows) {
          const period = getChange(row.original).period
          if (period !== undefined) {
            return CHANGE_SORT_HEADERS[period]
          }
        }
        return ''
      },
      sortUndefined: 'last',
      sortDescFirst: true,
      enableHiding: false,
      meta: {
        isChangeSortColumn: true,
      },
    }),
  ]
}
