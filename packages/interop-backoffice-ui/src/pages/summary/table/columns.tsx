import type { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { ArrowUpDownIcon } from 'lucide-react'
import { Button } from '~/components/core/Button'
import type { SummaryEventRow } from './types'

function SortableHeader(
  props: HeaderContext<SummaryEventRow, unknown> & { label: string },
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

export const eventsColumns: ColumnDef<SummaryEventRow>[] = [
  {
    accessorKey: 'type',
    header: (props) => <SortableHeader {...props} label="Type" />,
    meta: {
      csvHeader: 'Type',
    },
  },
  {
    accessorKey: 'direction',
    header: (props) => <SortableHeader {...props} label="Direction" />,
    cell: ({ row }) => row.original.direction ?? '-',
    meta: {
      csvHeader: 'Direction',
      csvValue: ({ row }) => row.original.direction ?? '-',
    },
  },
  {
    accessorKey: 'count',
    header: (props) => <SortableHeader {...props} label="All" />,
    meta: {
      csvHeader: 'All',
    },
  },
  {
    accessorKey: 'matched',
    header: (props) => <SortableHeader {...props} label="Matched" />,
    meta: {
      csvHeader: 'Matched',
    },
  },
  {
    accessorKey: 'unmatched',
    header: (props) => <SortableHeader {...props} label="Unmatched" />,
    meta: {
      csvHeader: 'Unmatched',
    },
  },
  {
    accessorKey: 'oldUnmatched',
    header: (props) => (
      <SortableHeader {...props} label="Unmatched (>2h ago)" />
    ),
    meta: {
      csvHeader: 'Unmatched (>2h ago)',
    },
  },
  {
    accessorKey: 'unsupported',
    header: (props) => <SortableHeader {...props} label="Unsupported" />,
    meta: {
      csvHeader: 'Unsupported',
    },
  },
]
