import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import { formatAge } from '~/utils/formatAge'
import { formatTimestamp } from '~/utils/formatTimestamp'
import { statusRank } from '~/utils/statusRank'
import type { DaTrackingStatusRow } from '../types'

const columnHelper = createColumnHelper<DaTrackingStatusRow>()

export const daTrackingStatusColumns: TableOptions<DaTrackingStatusRow>['columns'] =
  [
    columnHelper.accessor('status', {
      header: 'Status',
      sortingFn: (rowA, rowB, columnId) =>
        statusRank(rowA.getValue<DaTrackingStatusRow['status']>(columnId)) -
        statusRank(rowB.getValue<DaTrackingStatusRow['status']>(columnId)),
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
    columnHelper.accessor('daLayer', {
      header: 'DA layer',
      cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      meta: {
        csvHeader: 'DA layer',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('type', {
      header: 'Type',
      cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
      meta: {
        csvHeader: 'Type',
        filter: { kind: 'select' },
      },
    }),
    columnHelper.accessor('details', {
      header: 'Details',
      cell: ({ getValue }) => (
        <span className="font-mono text-xs">{getValue()}</span>
      ),
      meta: {
        csvHeader: 'Details',
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
    columnHelper.accessor('since', {
      header: 'Since',
      cell: ({ row }) => (
        <span className="font-mono text-xs">
          {formatSince(row.original.since, row.original.sinceUnit)}
        </span>
      ),
      meta: {
        csvHeader: 'Since',
        getCsvValue: ({ row }) =>
          formatSince(row.original.since, row.original.sinceUnit),
      },
    }),
  ]

function formatSince(value: number, unit: DaTrackingStatusRow['sinceUnit']) {
  if (unit === 'timestamp') {
    return `${formatTimestamp(value)} UTC`
  }

  return value.toString()
}
