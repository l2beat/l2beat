import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { SummaryMessagePairRow } from '../types'
import { formatDuration } from './utils'

export const messagePairsColumns: ColumnDef<SummaryMessagePairRow>[] = [
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
]
