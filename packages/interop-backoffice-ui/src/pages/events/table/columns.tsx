import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { EventStatsRow } from '../types'

export const eventStatsColumns: ColumnDef<EventStatsRow>[] = [
  {
    accessorKey: 'type',
    header: (props) => <SortableHeader {...props} label="Type" />,
    meta: {
      csvHeader: 'Type',
      fuzzySearch: true,
    },
  },
  {
    accessorKey: 'direction',
    header: (props) => <SortableHeader {...props} label="Direction" />,
    cell: ({ row }) => row.original.direction ?? '-',
    meta: {
      csvHeader: 'Direction',
      csvValue: ({ row }) => row.original.direction ?? '-',
      fuzzySearch: true,
      getFuzzySearchValue: ({ row }) => row.direction ?? '',
    },
  },
  {
    accessorKey: 'count',
    header: (props) => <SortableHeader {...props} label="All" />,
    cell: ({ row }) => (
      <Link
        className="underline underline-offset-4 hover:text-primary"
        to={`/events/all/${encodeURIComponent(row.original.type)}`}
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
        to={`/events/matched/${encodeURIComponent(row.original.type)}`}
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
        to={`/events/unmatched/${encodeURIComponent(row.original.type)}`}
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
        to={`/events/old-unmatched/${encodeURIComponent(row.original.type)}`}
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
        to={`/events/unsupported/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unsupported}
      </Link>
    ),
    meta: {
      csvHeader: 'Unsupported',
    },
  },
]
