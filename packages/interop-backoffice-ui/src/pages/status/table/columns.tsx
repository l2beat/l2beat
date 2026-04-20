import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { Badge } from '~/components/core/Badge'
import type { PluginStatusRow } from '../types'
import {
  compareOptionalBigIntStrings,
  formatDistanceFromNow,
  formatTimestamp,
} from './utils'

const columnHelper = createColumnHelper<PluginStatusRow>()

export const pluginStatusColumns: TableOptions<PluginStatusRow>['columns'] = [
  columnHelper.accessor('pluginName', {
    header: 'Plugin',
    meta: {
      csvHeader: 'Plugin',
    },
  }),
  columnHelper.accessor('chain', {
    header: 'Chain',
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue()}</span>
    ),
    meta: {
      csvHeader: 'Chain',
    },
  }),
  columnHelper.accessor((row) => row.syncMode ?? 'unknown', {
    id: 'syncMode',
    header: 'Sync mode',
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
    meta: {
      csvHeader: 'Sync mode',
    },
  }),
  columnHelper.accessor('toTimestamp', {
    header: 'Distance from now',
    enableGlobalFilter: false,
    cell: ({ getValue }) => {
      const value = getValue()

      return (
        <span
          className="font-mono text-xs"
          title={
            value !== undefined ? `${formatTimestamp(value)} UTC` : undefined
          }
        >
          {value !== undefined ? formatDistanceFromNow(value) : 'n/a'}
        </span>
      )
    },
    meta: {
      csvHeader: 'Distance from now',
      getCsvValue: ({ row }) =>
        row.original.toTimestamp !== undefined
          ? `${formatTimestamp(row.original.toTimestamp)} UTC`
          : 'n/a',
    },
  }),
  columnHelper.accessor('toBlock', {
    header: 'To block',
    sortingFn: (rowA, rowB, columnId) =>
      compareOptionalBigIntStrings(
        rowA.getValue<string | undefined>(columnId),
        rowB.getValue<string | undefined>(columnId),
      ),
    cell: ({ getValue }) => (
      <span className="font-mono text-xs">{getValue() ?? 'n/a'}</span>
    ),
    meta: {
      csvHeader: 'To block',
      getCsvValue: ({ row }) => row.original.toBlock ?? 'n/a',
    },
  }),
  columnHelper.accessor((row) => row.lastError ?? '', {
    id: 'lastError',
    header: 'Last error',
    cell: ({ row }) =>
      row.original.lastError ? (
        <div className="max-w-xl whitespace-normal break-all font-mono text-xs">
          {row.original.lastError}
        </div>
      ) : (
        <span className="text-muted-foreground">None</span>
      ),
    meta: {
      csvHeader: 'Last error',
      getCsvValue: ({ row }) => row.original.lastError ?? '',
    },
  }),
  columnHelper.accessor('resyncRequestedFrom', {
    header: 'Resync from',
    enableGlobalFilter: false,
    cell: ({ getValue }) => {
      const value = getValue()

      return (
        <span
          className="font-mono text-xs"
          title={
            value !== undefined ? `${formatTimestamp(value)} UTC` : undefined
          }
        >
          {value !== undefined ? formatDistanceFromNow(value) : '-'}
        </span>
      )
    },
    meta: {
      csvHeader: 'Resync from',
      getCsvValue: ({ row }) =>
        row.original.resyncRequestedFrom !== undefined
          ? `${formatTimestamp(row.original.resyncRequestedFrom)} UTC`
          : '',
    },
  }),
]
