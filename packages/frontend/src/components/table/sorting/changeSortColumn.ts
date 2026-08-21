import { assert } from '@l2beat/shared-pure'
import type { ColumnDef, ColumnHelper } from '@tanstack/react-table'
import type { PercentageChangePeriod } from '~/utils/calculatePercentageChange'

const CHANGE_SORT_HEADERS: Record<PercentageChangePeriod, string> = {
  '1D': '1D',
  '7D': '7D',
  last24h: '24H',
  last30d: '30D',
}

/**
 * Pairs a visible value column with a hidden companion that sorts by
 * percentage change. BasicTable renders both sort controls on the value header.
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

interface ChangeSortColumnDef {
  id?: string
  meta?: {
    isChangeSortColumn?: boolean
  }
  columns?: ChangeSortColumnDef[]
}

export function getChangeSortColumnVisibility(
  columns: ChangeSortColumnDef[],
): Record<string, false> {
  const visibility: Record<string, false> = {}

  function visit(cols: ChangeSortColumnDef[]) {
    for (const column of cols) {
      if (column.columns) {
        visit(column.columns)
      }
      if (column.meta?.isChangeSortColumn && column.id) {
        visibility[column.id] = false
      }
    }
  }

  visit(columns)
  return visibility
}
