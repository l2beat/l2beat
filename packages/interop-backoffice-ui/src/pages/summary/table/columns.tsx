import type { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '~/components/core/Button'
import type { SummaryEventRow } from './types'

function SortableHeader(
  props: HeaderContext<SummaryEventRow, unknown> & { label: string },
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
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={`/interop/events/all/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.count}
      </Link>
    ),
    meta: {
      csvHeader: 'All',
    },
  },
  {
    accessorKey: 'matched',
    header: (props) => <SortableHeader {...props} label="Matched" />,
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={`/interop/events/matched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.matched}
      </Link>
    ),
    meta: {
      csvHeader: 'Matched',
    },
  },
  {
    accessorKey: 'unmatched',
    header: (props) => <SortableHeader {...props} label="Unmatched" />,
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={`/interop/events/unmatched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unmatched}
      </Link>
    ),
    meta: {
      csvHeader: 'Unmatched',
    },
  },
  {
    accessorKey: 'oldUnmatched',
    header: (props) => (
      <SortableHeader {...props} label="Unmatched (>2h ago)" />
    ),
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={`/interop/events/old-unmatched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.oldUnmatched}
      </Link>
    ),
    meta: {
      csvHeader: 'Unmatched (>2h ago)',
    },
  },
  {
    accessorKey: 'unsupported',
    header: (props) => <SortableHeader {...props} label="Unsupported" />,
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={`/interop/events/unsupported/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unsupported}
      </Link>
    ),
    meta: {
      csvHeader: 'Unsupported',
    },
  },
]
