import { type ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { EventStatsRow } from '../types'

const columnHelper = createColumnHelper<EventStatsRow>()

export const eventStatsColumns = [
  columnHelper.accessor('type', {
    header: (props) => <SortableHeader {...props} label="Type" />,
    meta: {
      csvHeader: 'Type',
    },
  }),
  columnHelper.accessor('direction', {
    header: (props) => <SortableHeader {...props} label="Direction" />,
    cell: ({ row }) => row.original.direction ?? '-',
    meta: {
      csvHeader: 'Direction',
      getCsvValue: ({ row }) => row.original.direction ?? '-',
    },
  }),
  columnHelper.accessor('count', {
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
  }),
  columnHelper.accessor('matched', {
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
  }),
  columnHelper.accessor('unmatched', {
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
  }),
  columnHelper.accessor('oldUnmatched', {
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
  }),
  columnHelper.accessor('unsupported', {
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
  }),
] as unknown as ColumnDef<EventStatsRow>[]
