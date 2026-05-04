import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import type { TrackedTxsStatusRow } from '../types'
import { formatAge, formatTimestamp, statusRank } from '../utils'

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

        return (
          <Badge variant={value === 'fresh' ? 'secondary' : 'destructive'}>
            {value}
          </Badge>
        )
      },
      meta: {
        csvHeader: 'Status',
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
    columnHelper.accessor((row) => row.formulas.join(', '), {
      id: 'formulas',
      header: 'Formulas',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Formulas',
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
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{formatAge(getValue())}</span>
      ),
      meta: {
        csvHeader: 'Age',
        getCsvValue: ({ row }) => formatAge(row.original.ageSeconds),
      },
    }),
    columnHelper.accessor('configsWithDataCount', {
      header: 'Configs with data',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {row.original.configsWithDataCount}/{row.original.configsCount}
        </span>
      ),
      meta: {
        csvHeader: 'Configs with data',
        getCsvValue: ({ row }) =>
          `${row.original.configsWithDataCount}/${row.original.configsCount}`,
      },
    }),
    columnHelper.accessor('missingConfigsCount', {
      header: 'Missing configs',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Missing configs',
      },
    }),
    columnHelper.accessor('staleConfigsCount', {
      header: 'Stale configs',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Stale configs',
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
