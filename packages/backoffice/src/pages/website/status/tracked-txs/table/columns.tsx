import { formatSeconds } from '@l2beat/shared-pure'
import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import { formatTimestamp } from '~/utils/formatTimestamp'
import { statusRank } from '~/utils/statusRank'
import type { TrackedTxsStatusRow } from '../types'

const columnHelper = createColumnHelper<TrackedTxsStatusRow>()

export const trackedTxsStatusColumns: TableOptions<TrackedTxsStatusRow>['columns'] =
  [
    columnHelper.accessor('status', {
      header: 'Status',
      sortingFn: (rowA, rowB, columnId) =>
        statusRank(rowA.getValue<TrackedTxsStatusRow['status']>(columnId)) -
        statusRank(rowB.getValue<TrackedTxsStatusRow['status']>(columnId)),
      cell: ({ getValue }) => {
        const value = getValue()
        const className =
          value === 'missing'
            ? 'border-transparent bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100'
            : undefined

        return (
          <Badge
            variant={value === 'stale' ? 'destructive' : 'secondary'}
            className={className}
          >
            {value}
          </Badge>
        )
      },
      meta: {
        csvHeader: 'Status',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('configId', {
      header: 'Config ID',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Config ID',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('projectId', {
      header: 'Project',
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
      meta: {
        csvHeader: 'Project',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('feature', {
      header: 'Feature',
      cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      meta: {
        csvHeader: 'Feature',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('subtype', {
      header: 'Subtype',
      cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      meta: {
        csvHeader: 'Subtype',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('formula', {
      header: 'Formula',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Formula',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('latestTimestamp', {
      header: 'Latest data point',
      cell: ({ getValue }) => {
        const value = getValue()

        return (
          <span className="font-mono text-xs">
            {value !== undefined ? `${formatTimestamp(value)} UTC` : 'missing'}
          </span>
        )
      },
      meta: {
        csvHeader: 'Latest data point',
        getCsvValue: ({ row }) =>
          row.original.latestTimestamp !== undefined
            ? `${formatTimestamp(row.original.latestTimestamp)} UTC`
            : 'missing',
      },
    }),
    columnHelper.accessor('ageSeconds', {
      header: 'Age',
      cell: ({ getValue }) => {
        const value = getValue()

        return (
          <span className="font-mono text-xs">
            {value === undefined ? 'n/a' : formatSeconds(value)}
          </span>
        )
      },
      meta: {
        csvHeader: 'Age',
        getCsvValue: ({ row }) =>
          row.original.ageSeconds === undefined
            ? 'n/a'
            : formatSeconds(row.original.ageSeconds),
      },
    }),
    columnHelper.accessor('sinceTimestamp', {
      header: 'Since',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">
          {formatTimestamp(getValue())} UTC
        </span>
      ),
      meta: {
        csvHeader: 'Since',
        getCsvValue: ({ row }) =>
          `${formatTimestamp(row.original.sinceTimestamp)} UTC`,
      },
    }),
  ]
