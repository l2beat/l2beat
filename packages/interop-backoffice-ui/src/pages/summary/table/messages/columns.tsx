import type { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import type { SummaryMessageRow } from '../types'
import {
  formatDuration,
  formatKnownAppsRatio,
  getKnownAppsRatio,
} from './utils'

function SortableHeader(
  props: HeaderContext<SummaryMessageRow, unknown> & { label: string },
) {
  const { column, label } = props
  const sortState = column.getIsSorted()

  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3"
      onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
    >
      {label}
      {sortState === 'asc' ? (
        <ArrowUpIcon className="text-primary" />
      ) : sortState === 'desc' ? (
        <ArrowDownIcon className="text-primary" />
      ) : (
        <ArrowUpDownIcon className="opacity-50" />
      )}
    </Button>
  )
}

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
