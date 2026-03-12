import type { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import type { SummaryMessagePairRow } from '../types'
import { formatDuration } from './utils'

function SortableHeader(
  props: HeaderContext<SummaryMessagePairRow, unknown> & { label: string },
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
