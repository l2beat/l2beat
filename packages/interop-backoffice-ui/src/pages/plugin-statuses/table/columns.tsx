import type { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'
import { Badge } from '~/components/core/Badge'
import { Button } from '~/components/core/Button'
import type { PluginStatus } from './types'
import {
  getDistanceFromNow,
  getResyncFrom,
  getSyncModeBadgeVariant,
} from './utils'

function SortableHeader(
  props: HeaderContext<PluginStatus, unknown> & { label: string },
) {
  const { column, label } = props
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      <ArrowUpDownIcon />
    </Button>
  )
}

export const pluginStatusesColumns: ColumnDef<PluginStatus>[] = [
  {
    accessorKey: 'pluginName',
    header: (props) => <SortableHeader {...props} label="Plugin" />,
  },
  {
    accessorKey: 'chain',
    header: (props) => <SortableHeader {...props} label="Chain" />,
  },
  {
    accessorKey: 'syncMode',
    header: (props) => <SortableHeader {...props} label="Sync mode" />,
    cell: ({ row }) => (
      <Badge variant={getSyncModeBadgeVariant(row.original.syncMode)}>
        {row.original.syncMode ?? '?'}
      </Badge>
    ),
  },
  {
    id: 'distanceFromNow',
    accessorFn: (row) => row.toTimestamp ?? -1,
    header: (props) => <SortableHeader {...props} label="Distance from now" />,
    cell: ({ row }) => getDistanceFromNow(row.original.toTimestamp),
  },
  {
    accessorKey: 'toBlock',
    header: (props) => <SortableHeader {...props} label="To block" />,
    cell: ({ row }) => row.original.toBlock ?? 'n/a',
  },
  {
    accessorKey: 'lastError',
    header: (props) => <SortableHeader {...props} label="Last error" />,
    cell: ({ row }) => (
      <div className="max-w-[420px] whitespace-normal break-words">
        {row.original.lastError ?? ''}
      </div>
    ),
  },
  {
    id: 'resyncFrom',
    accessorFn: (row) => row.resyncRequestedFrom ?? -1,
    header: (props) => <SortableHeader {...props} label="Resync from" />,
    cell: ({ row }) => getResyncFrom(row.original.resyncRequestedFrom),
  },
]
