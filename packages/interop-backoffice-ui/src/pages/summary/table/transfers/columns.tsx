import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { SortableHeader } from '~/components/table/SortableHeader'
import { buildTransferDetailsPath } from '../transfers-details/utils'
import type { SummaryTransferRow } from '../types'
import { formatDollars, formatDuration } from './utils'

export const transfersColumns: ColumnDef<SummaryTransferRow>[] = [
  {
    accessorKey: 'plugin',
    header: (props) => <SortableHeader {...props} label="Plugin" />,
    meta: {
      csvHeader: 'Plugin',
    },
  },
  {
    accessorKey: 'type',
    header: (props) => <SortableHeader {...props} label="Type" />,
    meta: {
      csvHeader: 'Type',
    },
  },
  {
    accessorKey: 'count',
    header: (props) => <SortableHeader {...props} label="Count" />,
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={buildTransferDetailsPath({
          type: row.original.type,
          plugin: row.original.plugin,
        })}
      >
        {row.original.count}
      </Link>
    ),
    meta: {
      csvHeader: 'Count',
    },
  },
  {
    id: 'avgDuration',
    accessorFn: (row) => row.avgDuration,
    header: (props) => <SortableHeader {...props} label="Median duration" />,
    cell: ({ row }) => formatDuration(row.original.avgDuration),
    meta: {
      csvHeader: 'Median duration',
      csvValue: ({ row }) => formatDuration(row.original.avgDuration),
    },
  },
  {
    id: 'srcValueSum',
    accessorFn: (row) => row.srcValueSum,
    header: (props) => <SortableHeader {...props} label="Source value" />,
    cell: ({ row }) => formatDollars(row.original.srcValueSum),
    meta: {
      csvHeader: 'Source value',
      csvValue: ({ row }) => formatDollars(row.original.srcValueSum),
    },
  },
  {
    id: 'dstValueSum',
    accessorFn: (row) => row.dstValueSum,
    header: (props) => <SortableHeader {...props} label="Destination value" />,
    cell: ({ row }) => formatDollars(row.original.dstValueSum),
    meta: {
      csvHeader: 'Destination value',
      csvValue: ({ row }) => formatDollars(row.original.dstValueSum),
    },
  },
  {
    id: 'pairsCount',
    accessorFn: (row) => row.chains.length,
    header: (props) => <SortableHeader {...props} label="Chain pairs" />,
    cell: ({ row }) => row.original.chains.length,
    meta: {
      csvHeader: 'Chain pairs',
      csvValue: ({ row }) => String(row.original.chains.length),
    },
  },
]
