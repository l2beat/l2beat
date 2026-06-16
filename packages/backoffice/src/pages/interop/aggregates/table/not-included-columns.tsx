import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { formatDollars } from '~/pages/interop/transfers/utils'
import type { NotIncludedByPluginRow } from '../types'

const columnHelper = createColumnHelper<NotIncludedByPluginRow>()

export const notIncludedByPluginColumns: TableOptions<NotIncludedByPluginRow>['columns'] =
  [
    columnHelper.accessor('plugin', {
      header: 'Plugin',
      meta: {
        csvHeader: 'Plugin',
      },
    }),
    columnHelper.accessor('bridgeType', {
      header: 'Bridge type',
      meta: {
        csvHeader: 'Bridge type',
      },
    }),
    columnHelper.accessor('count', {
      header: 'Count',
      meta: {
        csvHeader: 'Count',
        getCsvValue: ({ row }) => String(row.original.count),
      },
    }),
    columnHelper.accessor('totalValueUsd', {
      header: 'Total value USD',
      cell: ({ getValue }) => formatDollars(getValue()),
      meta: {
        csvHeader: 'Total value USD',
        getCsvValue: ({ row }) => formatDollars(row.original.totalValueUsd),
      },
    }),
  ]
