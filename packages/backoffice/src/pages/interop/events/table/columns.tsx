import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { InternalLink } from '~/components/InternalLink'
import type { EventStatsRow } from '../types'

const columnHelper = createColumnHelper<EventStatsRow>()

export const eventStatsColumns: TableOptions<EventStatsRow>['columns'] = [
  columnHelper.accessor('type', {
    header: 'Type',
    meta: {
      csvHeader: 'Type',
      filter: {
        kind: 'select',
      },
    },
  }),
  columnHelper.accessor('direction', {
    header: 'Direction',
    cell: ({ row }) => row.original.direction ?? '-',
    meta: {
      csvHeader: 'Direction',
      getCsvValue: ({ row }) => row.original.direction ?? '-',
      filter: {
        kind: 'select',
      },
    },
  }),
  columnHelper.accessor('count', {
    header: 'All',
    cell: ({ row }) => (
      <InternalLink
        to={`/interop/events/all/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.count}
      </InternalLink>
    ),
    meta: {
      csvHeader: 'All',
    },
  }),
  columnHelper.accessor('matched', {
    header: 'Matched',
    cell: ({ row }) => (
      <InternalLink
        to={`/interop/events/matched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.matched}
      </InternalLink>
    ),
    meta: {
      csvHeader: 'Matched',
    },
  }),
  columnHelper.accessor('unmatched', {
    header: 'Unmatched',
    cell: ({ row }) => (
      <InternalLink
        to={`/interop/events/unmatched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unmatched}
      </InternalLink>
    ),
    meta: {
      csvHeader: 'Unmatched',
    },
  }),
  columnHelper.accessor('oldUnmatched', {
    header: 'Unmatched (>2h ago)',
    cell: ({ row }) => (
      <InternalLink
        to={`/interop/events/old-unmatched/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.oldUnmatched}
      </InternalLink>
    ),
    meta: {
      csvHeader: 'Unmatched (>2h ago)',
    },
  }),
  columnHelper.accessor('unsupported', {
    header: 'Unsupported',
    cell: ({ row }) => (
      <InternalLink
        to={`/interop/events/unsupported/${encodeURIComponent(row.original.type)}`}
      >
        {row.original.unsupported}
      </InternalLink>
    ),
    meta: {
      csvHeader: 'Unsupported',
    },
  }),
]
