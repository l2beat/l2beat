import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import { SortableHeader } from '~/components/table/SortableHeader'
import type { EventStatsRow } from '../types'

const columnHelper = createColumnHelper<EventStatsRow>()

export const eventStatsColumns: TableOptions<EventStatsRow>['columns'] = [
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
      <CellLink to={`/events/all/${encodeURIComponent(row.original.type)}`}>
        {row.original.count}
      </CellLink>
    ),
    meta: {
      csvHeader: 'All',
    },
  }),
  columnHelper.accessor('matched', {
    header: (props) => <SortableHeader {...props} label="Matched" />,
    cell: ({ row }) => (
      <CellLink to={`/events/matched/${encodeURIComponent(row.original.type)}`}>
        {row.original.matched}
      </CellLink>
    ),
    meta: {
      csvHeader: 'Matched',
    },
  }),
  columnHelper.accessor('unmatched', {
    header: (props) => <SortableHeader {...props} label="Unmatched" />,
    cell: ({ row }) => (
      <CellLink
        to={`/events/unmatched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unmatched}
      </CellLink>
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
      <CellLink
        to={`/events/old-unmatched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.oldUnmatched}
      </CellLink>
    ),
    meta: {
      csvHeader: 'Unmatched (>2h ago)',
    },
  }),
  columnHelper.accessor('unsupported', {
    header: (props) => <SortableHeader {...props} label="Unsupported" />,
    cell: ({ row }) => (
      <CellLink
        to={`/events/unsupported/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unsupported}
      </CellLink>
    ),
    meta: {
      csvHeader: 'Unsupported',
    },
  }),
]
