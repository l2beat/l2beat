import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryTransferPairRow } from '../types'
import { formatDollars, formatDuration } from './utils'

export const transferPairsColumns: ColumnDef<SummaryTransferPairRow>[] = [
  {
    accessorKey: 'srcChain',
    header: (props) => <SortableHeader {...props} label="Source chain" />,
    meta: {
      csvHeader: 'Source chain',
    },
  },
  {
    accessorKey: 'dstChain',
    header: (props) => <SortableHeader {...props} label="Destination chain" />,
    meta: {
      csvHeader: 'Destination chain',
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
]
