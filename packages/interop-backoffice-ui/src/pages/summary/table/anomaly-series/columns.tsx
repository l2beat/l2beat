import type { ColumnDef } from '@tanstack/react-table'
import { SortableHeader } from '~/components/table/SortableHeader'
import { formatDollars } from '../transfers/utils'
import type { SummaryAnomalySeriesPoint } from '../types'
import {
  formatAvgDuration,
  formatSeconds,
  formatSeriesTimestamp,
  relativePercentDifference,
  toCsvIsoTimestamp,
} from './utils'

export const anomalySeriesColumns: ColumnDef<SummaryAnomalySeriesPoint>[] = [
  {
    id: 'timestamp',
    accessorFn: (row) => row.timestamp,
    header: (props) => <SortableHeader {...props} label="Day (UTC)" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {formatSeriesTimestamp(row.original.timestamp)}
      </span>
    ),
    meta: {
      csvHeader: 'Day (UTC)',
      csvValue: ({ row }) => toCsvIsoTimestamp(row.original.timestamp),
    },
  },
  {
    accessorKey: 'transferCount',
    header: (props) => <SortableHeader {...props} label="Transfer count" />,
    meta: {
      csvHeader: 'Transfer count',
    },
  },
  {
    id: 'avgDuration',
    accessorFn: (row) =>
      formatAvgDuration(row.totalDurationSum, row.transferCount),
    header: (props) => <SortableHeader {...props} label="Avg duration" />,
    cell: ({ row }) =>
      formatSeconds(
        formatAvgDuration(
          row.original.totalDurationSum,
          row.original.transferCount,
        ),
      ),
    meta: {
      csvHeader: 'Avg duration',
      csvValue: ({ row }) =>
        formatSeconds(
          formatAvgDuration(
            row.original.totalDurationSum,
            row.original.transferCount,
          ),
        ),
    },
  },
  {
    accessorKey: 'totalSrcValueUsd',
    header: (props) => <SortableHeader {...props} label="Src volume (USD)" />,
    cell: ({ row }) => formatDollars(row.original.totalSrcValueUsd),
    meta: {
      csvHeader: 'Src volume (USD)',
      csvValue: ({ row }) => formatDollars(row.original.totalSrcValueUsd),
    },
  },
  {
    accessorKey: 'totalDstValueUsd',
    header: (props) => <SortableHeader {...props} label="Dst volume (USD)" />,
    cell: ({ row }) => formatDollars(row.original.totalDstValueUsd),
    meta: {
      csvHeader: 'Dst volume (USD)',
      csvValue: ({ row }) => formatDollars(row.original.totalDstValueUsd),
    },
  },
  {
    id: 'srcDstDiff',
    accessorFn: (row) =>
      relativePercentDifference(row.totalSrcValueUsd, row.totalDstValueUsd) ??
      -1,
    header: (props) => <SortableHeader {...props} label="Src/Dst diff %" />,
    cell: ({ row }) => {
      const value = relativePercentDifference(
        row.original.totalSrcValueUsd,
        row.original.totalDstValueUsd,
      )
      if (value === null) {
        return '-'
      }
      return `${value.toFixed(2)}%`
    },
    meta: {
      csvHeader: 'Src/Dst diff %',
      csvValue: ({ row }) => {
        const value = relativePercentDifference(
          row.original.totalSrcValueUsd,
          row.original.totalDstValueUsd,
        )
        return value === null ? '-' : `${value.toFixed(2)}%`
      },
    },
  },
]
