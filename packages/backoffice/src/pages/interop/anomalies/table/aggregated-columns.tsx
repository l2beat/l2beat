import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import { formatDollars } from '~/pages/interop/transfers/utils'
import type { AggregatedAnomalyRow } from '../types'
import { buildAnomalyDetailsPath, formatGapPercent } from '../utils'
import { MetricLine } from './cells/MetricLine'

const columnHelper = createColumnHelper<AggregatedAnomalyRow>()

export function createAggregatedAnomalyColumns(): TableOptions<AggregatedAnomalyRow>['columns'] {
  return [
    columnHelper.accessor('timestamp', {
      header: 'Day (UTC)',
      cell: ({ row }) => (
        <div className="flex min-w-[6.5rem] flex-col gap-0.5 text-xs">
          <span className="font-medium">{row.original.timestamp}</span>
          <span className="text-muted-foreground">
            {row.original.dataPoints.length}d
          </span>
        </div>
      ),
      meta: {
        csvHeader: 'Day (UTC)',
      },
    }),
    columnHelper.accessor('id', {
      header: 'Aggregate ID',
      cell: ({ row }) => (
        <div className="flex min-w-[9rem] flex-col">
          <CellLink
            to={buildAnomalyDetailsPath(row.original)}
            className="text-xs"
          >
            {row.original.id}
          </CellLink>
        </div>
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Aggregate ID',
      },
    }),
    columnHelper.accessor('interpretation', {
      header: 'Alert',
      cell: ({ row }) => {
        const alerts = row.original.interpretation
          .split('\n')
          .map((alert) => alert.trim())
          .filter((alert) => alert.length > 0)

        return alerts.length > 0 ? (
          <ul
            className="w-[14rem] min-w-[14rem] list-disc space-y-1 pl-4 text-xs leading-4"
            title={row.original.interpretation}
          >
            {alerts.map((alert) => (
              <li key={alert} className="whitespace-normal break-words">
                {alert}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        )
      },
      meta: {
        csvHeader: 'Interpretation',
        getCsvValue: ({ row }) => row.original.interpretation || '-',
      },
    }),
    columnHelper.accessor(
      (row: AggregatedAnomalyRow) => `${row.srcChain} -> ${row.dstChain}`,
      {
        id: 'route',
        header: 'Route',
        cell: ({ row }) => (
          <div className="flex min-w-[7rem] flex-col gap-0.5 text-xs">
            <span className="font-medium">{row.original.srcChain}</span>
            <span className="text-muted-foreground">
              → {row.original.dstChain}
            </span>
          </div>
        ),
        meta: {
          csvHeader: 'Route',
          getCsvValue: ({ row }) =>
            `${row.original.srcChain} -> ${row.original.dstChain}`,
        },
      },
    ),
    columnHelper.accessor((row: AggregatedAnomalyRow) => row.counts.last, {
      id: 'count',
      header: 'Count',
      cell: ({ row }) => (
        <CellLink
          to={buildAnomalyDetailsPath(row.original)}
          className="text-xs"
        >
          {Math.round(row.original.counts.last).toLocaleString()}
        </CellLink>
      ),
      meta: {
        csvHeader: 'Count',
      },
    }),
    columnHelper.accessor(
      (row: AggregatedAnomalyRow) =>
        Math.max(row.srcVolume.valueUsd.last, row.dstVolume.valueUsd.last),
      {
        id: 'volumeUsd',
        header: 'Volume (USD)',
        cell: ({ row }) => (
          <div className="flex min-w-[8rem] flex-col gap-0.5 text-xs">
            <MetricLine>
              Src {formatDollars(row.original.srcVolume.valueUsd.last)}
            </MetricLine>
            <MetricLine>
              Dst {formatDollars(row.original.dstVolume.valueUsd.last)}
            </MetricLine>
          </div>
        ),
        enableGlobalFilter: false,
        meta: {
          csvHeader: 'Volume (USD)',
          getCsvValue: ({ row }) =>
            `Src ${formatDollars(row.original.srcVolume.valueUsd.last)} | Dst ${formatDollars(row.original.dstVolume.valueUsd.last)}`,
        },
      },
    ),
    columnHelper.accessor(
      (row: AggregatedAnomalyRow) => row.srcDstDiff.lastPercent ?? -1,
      {
        id: 'srcDstDiff',
        header: 'Src/Dst diff %',
        cell: ({ row }) => {
          return (
            <div className="flex min-w-[8rem] flex-col gap-0.5">
              <span
                className="text-xs"
                style={{
                  color: row.original.srcDstDiff.isSideMismatch
                    ? 'var(--color-destructive)'
                    : 'var(--color-chart-2)',
                  fontWeight: row.original.srcDstDiff.isSideMismatch
                    ? 700
                    : 600,
                }}
              >
                Now {formatGapPercent(row.original.srcDstDiff.lastPercent)}
              </span>
              <MetricLine>
                1d {formatGapPercent(row.original.srcDstDiff.prevDayPercent)} |
                7d {formatGapPercent(row.original.srcDstDiff.prev7dPercent)}
              </MetricLine>
            </div>
          )
        },
        enableGlobalFilter: false,
        meta: {
          csvHeader: 'Src/Dst diff %',
          getCsvValue: ({ row }) =>
            `Now ${formatGapPercent(row.original.srcDstDiff.lastPercent)} | 1d ${formatGapPercent(row.original.srcDstDiff.prevDayPercent)} | 7d ${formatGapPercent(row.original.srcDstDiff.prev7dPercent)}`,
        },
      },
    ),
    columnHelper.accessor('bridgeType', {
      header: 'Bridge type',
      cell: ({ row }) =>
        row.original.bridgeType ? (
          <span className="text-xs">{row.original.bridgeType}</span>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        ),
      meta: { csvHeader: 'Bridge type' },
    }),
  ]
}
