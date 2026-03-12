import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { ProcessorStatusRow } from './types'
import {
  formatDistanceFromNow,
  formatProcessorTimestamp,
  toIsoTimestamp,
} from './utils'

export const processorStatusesColumns: ColumnDef<ProcessorStatusRow>[] = [
  {
    accessorKey: 'chain',
    header: (props) => <SortableHeader {...props} label="Chain" />,
    meta: {
      csvHeader: 'Chain',
    },
  },
  {
    accessorKey: 'block',
    header: (props) => <SortableHeader {...props} label="Latest block" />,
    meta: {
      csvHeader: 'Latest block',
    },
  },
  {
    id: 'timestamp',
    accessorFn: (row) => row.timestamp,
    header: (props) => <SortableHeader {...props} label="Latest timestamp" />,
    cell: ({ row }) => formatProcessorTimestamp(row.original.timestamp),
    meta: {
      csvHeader: 'Latest timestamp',
      csvValue: ({ row }) => toIsoTimestamp(row.original.timestamp),
    },
  },
  {
    id: 'distanceFromNow',
    accessorFn: (row) => row.timestamp,
    header: (props) => <SortableHeader {...props} label="Distance from now" />,
    cell: ({ row }) => formatDistanceFromNow(row.original.timestamp),
    meta: {
      csvHeader: 'Distance from now',
      csvValue: ({ row }) => formatDistanceFromNow(row.original.timestamp),
    },
  },
]
