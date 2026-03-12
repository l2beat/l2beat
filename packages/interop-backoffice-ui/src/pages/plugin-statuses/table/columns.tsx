import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { PluginStatus } from './types'
import {
  getDistanceFromNow,
  getResyncFrom,
  getSyncModeBadgeVariant,
} from './utils'

export const pluginStatusesColumns: ColumnDef<PluginStatus>[] = [
  {
    accessorKey: 'pluginName',
    header: (props) => <SortableHeader {...props} label="Plugin" />,
    meta: {
      csvHeader: 'Plugin',
    },
  },
  {
    accessorKey: 'chain',
    header: (props) => <SortableHeader {...props} label="Chain" />,
    meta: {
      csvHeader: 'Chain',
    },
  },
  {
    accessorKey: 'syncMode',
    header: (props) => <SortableHeader {...props} label="Sync mode" />,
    cell: ({ row }) => (
      <Badge variant={getSyncModeBadgeVariant(row.original.syncMode)}>
        {row.original.syncMode ?? '?'}
      </Badge>
    ),
    meta: {
      csvHeader: 'Sync mode',
      csvValue: ({ row }) => row.original.syncMode ?? '?',
    },
  },
  {
    id: 'distanceFromNow',
    accessorFn: (row) => row.toTimestamp ?? -1,
    header: (props) => <SortableHeader {...props} label="Distance from now" />,
    cell: ({ row }) => getDistanceFromNow(row.original.toTimestamp),
    meta: {
      csvHeader: 'Distance from now',
      csvValue: ({ row }) => getDistanceFromNow(row.original.toTimestamp),
    },
  },
  {
    accessorKey: 'toBlock',
    header: (props) => <SortableHeader {...props} label="To block" />,
    cell: ({ row }) => row.original.toBlock ?? 'n/a',
    meta: {
      csvHeader: 'To block',
      csvValue: ({ row }) => row.original.toBlock ?? 'n/a',
    },
  },
  {
    accessorKey: 'lastError',
    header: (props) => <SortableHeader {...props} label="Last error" />,
    cell: ({ row }) => (
      <div className="max-w-[420px] whitespace-normal break-words">
        {row.original.lastError ?? ''}
      </div>
    ),
    meta: {
      csvHeader: 'Last error',
      csvValue: ({ row }) => row.original.lastError ?? '',
    },
  },
  {
    id: 'resyncFrom',
    accessorFn: (row) => row.resyncRequestedFrom ?? -1,
    header: (props) => <SortableHeader {...props} label="Resync from" />,
    cell: ({ row }) => getResyncFrom(row.original.resyncRequestedFrom),
    meta: {
      csvHeader: 'Resync from',
      csvValue: ({ row }) => getResyncFrom(row.original.resyncRequestedFrom),
    },
  },
]
