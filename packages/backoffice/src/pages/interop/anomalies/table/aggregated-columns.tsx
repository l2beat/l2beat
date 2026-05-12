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
        <div className="flex min-w-[8rem] flex-col">
          <span>{row.original.timestamp}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.dataPoints.length}d history
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
        <div className="flex min-w-[12rem] flex-col gap-1">
          <CellLink to={buildAnomalyDetailsPath(row.original.id)}>
            {row.original.id}
          </CellLink>
          <span className="text-muted-foreground text-xs">Open charts</span>
        </div>
      ),
      enableSorting: false,
      meta: {
        csvHeader: 'Transfer ID',
      },
    }),
    columnHelper.accessor((row: AggregatedAnomalyRow) => row.counts.last, {
      id: 'count',
      header: 'Count',
      cell: ({ row }) => (
        <CellLink to={buildAnomalyDetailsPath(row.original.id)}>
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
          <div className="flex min-w-[10rem] flex-col">
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
            <div className="flex min-w-[10rem] flex-col">
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
    columnHelper.accessor('interpretation', {
      header: 'Alert',
      cell: ({ row }) =>
        row.original.interpretation.length > 0 ? (
          <div className="min-w-[18rem]">{row.original.interpretation}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
      meta: {
        csvHeader: 'Interpretation',
        getCsvValue: ({ row }) => row.original.interpretation || '-',
      },
    }),
  ]
}
