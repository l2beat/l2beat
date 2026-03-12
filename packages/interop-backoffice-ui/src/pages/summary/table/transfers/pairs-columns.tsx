import type { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import type { SummaryTransferPairRow } from '../types'
import { formatDollars, formatDuration } from './utils'

function SortableHeader(
  props: HeaderContext<SummaryTransferPairRow, unknown> & { label: string },
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
