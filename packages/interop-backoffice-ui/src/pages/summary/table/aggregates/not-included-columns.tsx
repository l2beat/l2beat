import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import { formatDollars } from '../transfers/utils'
import type { SummaryAggregateNotIncludedByPluginRow } from '../types'

export const notIncludedByPluginColumns: ColumnDef<SummaryAggregateNotIncludedByPluginRow>[] =
  [
    {
      accessorKey: 'plugin',
      header: (props) => <SortableHeader {...props} label="Plugin" />,
      meta: {
        csvHeader: 'Plugin',
      },
    },
    {
      accessorKey: 'bridgeType',
      header: (props) => <SortableHeader {...props} label="Bridge type" />,
      meta: {
        csvHeader: 'Bridge type',
      },
    },
    {
      accessorKey: 'count',
      header: (props) => <SortableHeader {...props} label="Count" />,
      meta: {
        csvHeader: 'Count',
      },
    },
    {
      id: 'totalValueUsd',
      accessorFn: (row) => row.totalValueUsd,
      header: (props) => <SortableHeader {...props} label="Total value USD" />,
      cell: ({ row }) => formatDollars(row.original.totalValueUsd),
      meta: {
        csvHeader: 'Total value USD',
        csvValue: ({ row }) => formatDollars(row.original.totalValueUsd),
      },
    },
  ]
