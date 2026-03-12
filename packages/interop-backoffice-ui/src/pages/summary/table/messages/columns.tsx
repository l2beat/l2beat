import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { SortableHeader } from '~/components/table/SortableHeader'
import { buildMessageDetailsPath } from '../messages-details/utils'
import type { SummaryMessageRow } from '../types'
import {
  formatDuration,
  formatKnownAppsRatio,
  getKnownAppsRatio,
} from './utils'

export const messagesColumns: ColumnDef<SummaryMessageRow>[] = [
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
        to={buildMessageDetailsPath({
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
    id: 'knownAppsRatio',
    accessorFn: (row) => getKnownAppsRatio(row.knownAppCount, row.count),
    header: (props) => <SortableHeader {...props} label="Known %" />,
    cell: ({ row }) =>
      formatKnownAppsRatio(row.original.knownAppCount, row.original.count),
    meta: {
      csvHeader: 'Known %',
      csvValue: ({ row }) =>
        formatKnownAppsRatio(row.original.knownAppCount, row.original.count),
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
