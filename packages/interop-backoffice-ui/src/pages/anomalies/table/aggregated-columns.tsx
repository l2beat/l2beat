import { createColumnHelper, type TableOptions } from '@tanstack/react-table'
import { CellLink } from '~/components/table/CellLink'
import { formatDollars } from '~/pages/transfers/utils'
import type { AggregatedAnomalyRow } from '../types'
import {
  buildAnomalyDetailsPath,
  formatGapPercent,
  formatPercent,
  formatSignedDiff,
  getSummaryValues,
} from '../utils'
import { CountDeltaCell } from './cells/CountDeltaCell'
import { MetricLine } from './cells/MetricLine'
import { MiniChartsCell } from './cells/MiniChartCell'
import { PercentBySourceCell } from './cells/PercentBySoureCell'

const columnHelper = createColumnHelper<AggregatedAnomalyRow>()

export function createAggregatedAnomalyColumns(options: {
  aggregateValueDiffAlertThresholdPercent: number
}): TableOptions<AggregatedAnomalyRow>['columns'] {
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
      (row: AggregatedAnomalyRow) => {
        const summary = getSummaryValues(
          row.counts.last,
          row.counts.prevDay,
          row.counts.prev7d,
        )

        return Math.max(
          Math.abs(summary.pctDiffDay ?? 0),
          Math.abs(summary.pctDiff7d ?? 0),
        )
      },
      {
        id: 'countDelta',
        header: 'Count Δ',
        cell: ({ row }) => {
          const summary = getSummaryValues(
            row.original.counts.last,
            row.original.counts.prevDay,
            row.original.counts.prev7d,
          )

          return (
            <CountDeltaCell
              diffDay={summary.diffDay}
              diff7d={summary.diff7d}
              pctDiffDay={summary.pctDiffDay}
              pctDiff7d={summary.pctDiff7d}
            />
          )
        },
        enableGlobalFilter: false,
        meta: {
          csvHeader: 'Count Δ',
          getCsvValue: ({ row }) => {
            const summary = getSummaryValues(
              row.original.counts.last,
              row.original.counts.prevDay,
              row.original.counts.prev7d,
            )

            return `1d ${formatSignedDiff(summary.diffDay, 0)} (${formatPercent(summary.pctDiffDay)}) | 7d ${formatSignedDiff(summary.diff7d, 0)} (${formatPercent(summary.pctDiff7d)})`
          },
        },
      },
    ),
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
      (row: AggregatedAnomalyRow) => {
        const src = getSummaryValues(
          row.srcVolume.valueUsd.last,
          row.srcVolume.valueUsd.prevDay,
          row.srcVolume.valueUsd.prev7d,
        )
        const dst = getSummaryValues(
          row.dstVolume.valueUsd.last,
          row.dstVolume.valueUsd.prevDay,
          row.dstVolume.valueUsd.prev7d,
        )

        return Math.max(
          Math.abs(src.pctDiffDay ?? 0),
          Math.abs(src.pctDiff7d ?? 0),
          Math.abs(dst.pctDiffDay ?? 0),
          Math.abs(dst.pctDiff7d ?? 0),
        )
      },
      {
        id: 'volumeDeltaPercent',
        header: 'Volume Δ%',
        cell: ({ row }) => {
          const src = getSummaryValues(
            row.original.srcVolume.valueUsd.last,
            row.original.srcVolume.valueUsd.prevDay,
            row.original.srcVolume.valueUsd.prev7d,
          )
          const dst = getSummaryValues(
            row.original.dstVolume.valueUsd.last,
            row.original.dstVolume.valueUsd.prevDay,
            row.original.dstVolume.valueUsd.prev7d,
          )

          return (
            <PercentBySourceCell
              srcPctDay={src.pctDiffDay}
              srcPct7d={src.pctDiff7d}
              dstPctDay={dst.pctDiffDay}
              dstPct7d={dst.pctDiff7d}
            />
          )
        },
        enableGlobalFilter: false,
        meta: {
          csvHeader: 'Volume Δ%',
          getCsvValue: ({ row }) => {
            const src = getSummaryValues(
              row.original.srcVolume.valueUsd.last,
              row.original.srcVolume.valueUsd.prevDay,
              row.original.srcVolume.valueUsd.prev7d,
            )
            const dst = getSummaryValues(
              row.original.dstVolume.valueUsd.last,
              row.original.dstVolume.valueUsd.prevDay,
              row.original.dstVolume.valueUsd.prev7d,
            )

            return `Src 1d ${formatPercent(src.pctDiffDay)} | Src 7d ${formatPercent(src.pctDiff7d)} | Dst 1d ${formatPercent(dst.pctDiffDay)} | Dst 7d ${formatPercent(dst.pctDiff7d)}`
          },
        },
      },
    ),
    columnHelper.accessor(
      (row: AggregatedAnomalyRow) => row.srcDstDiff.lastPercent ?? -1,
      {
        id: 'srcDstDiff',
        header: 'Src/Dst diff %',
        cell: ({ row }) => {
          const isHigh =
            row.original.srcDstDiff.lastPercent !== null &&
            row.original.srcDstDiff.lastPercent >
              options.aggregateValueDiffAlertThresholdPercent

          return (
            <div className="flex min-w-[10rem] flex-col">
              <span
                className="text-xs"
                style={{
                  color: isHigh
                    ? 'var(--color-destructive)'
                    : 'var(--color-chart-2)',
                  fontWeight: isHigh ? 700 : 600,
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
    columnHelper.accessor(
      (row: AggregatedAnomalyRow) =>
        Math.max(
          row.srcVolume.avgValuePerTransfer.last ?? 0,
          row.dstVolume.avgValuePerTransfer.last ?? 0,
        ),
      {
        id: 'avgVolumePerTransfer',
        header: 'Avg vol/tx',
        cell: ({ row }) => (
          <div className="flex min-w-[10rem] flex-col">
            <MetricLine>
              Src{' '}
              {formatDollars(row.original.srcVolume.avgValuePerTransfer.last)}
            </MetricLine>
            <MetricLine>
              Dst{' '}
              {formatDollars(row.original.dstVolume.avgValuePerTransfer.last)}
            </MetricLine>
          </div>
        ),
        enableGlobalFilter: false,
        meta: {
          csvHeader: 'Avg vol/tx',
          getCsvValue: ({ row }) =>
            `Src ${formatDollars(row.original.srcVolume.avgValuePerTransfer.last)} | Dst ${formatDollars(row.original.dstVolume.avgValuePerTransfer.last)}`,
        },
      },
    ),
    columnHelper.accessor(
      (row: AggregatedAnomalyRow) => {
        const src = getSummaryValues(
          row.srcVolume.avgValuePerTransfer.last,
          row.srcVolume.avgValuePerTransfer.prevDay,
          row.srcVolume.avgValuePerTransfer.prev7d,
        )
        const dst = getSummaryValues(
          row.dstVolume.avgValuePerTransfer.last,
          row.dstVolume.avgValuePerTransfer.prevDay,
          row.dstVolume.avgValuePerTransfer.prev7d,
        )

        return Math.max(
          Math.abs(src.pctDiffDay ?? 0),
          Math.abs(src.pctDiff7d ?? 0),
          Math.abs(dst.pctDiffDay ?? 0),
          Math.abs(dst.pctDiff7d ?? 0),
        )
      },
      {
        id: 'avgVolumeDeltaPercent',
        header: 'Avg vol/tx Δ%',
        cell: ({ row }) => {
          const src = getSummaryValues(
            row.original.srcVolume.avgValuePerTransfer.last,
            row.original.srcVolume.avgValuePerTransfer.prevDay,
            row.original.srcVolume.avgValuePerTransfer.prev7d,
          )
          const dst = getSummaryValues(
            row.original.dstVolume.avgValuePerTransfer.last,
            row.original.dstVolume.avgValuePerTransfer.prevDay,
            row.original.dstVolume.avgValuePerTransfer.prev7d,
          )

          return (
            <PercentBySourceCell
              srcPctDay={src.pctDiffDay}
              srcPct7d={src.pctDiff7d}
              dstPctDay={dst.pctDiffDay}
              dstPct7d={dst.pctDiff7d}
            />
          )
        },
        enableGlobalFilter: false,
        meta: {
          csvHeader: 'Avg vol/tx Δ%',
          getCsvValue: ({ row }) => {
            const src = getSummaryValues(
              row.original.srcVolume.avgValuePerTransfer.last,
              row.original.srcVolume.avgValuePerTransfer.prevDay,
              row.original.srcVolume.avgValuePerTransfer.prev7d,
            )
            const dst = getSummaryValues(
              row.original.dstVolume.avgValuePerTransfer.last,
              row.original.dstVolume.avgValuePerTransfer.prevDay,
              row.original.dstVolume.avgValuePerTransfer.prev7d,
            )

            return `Src 1d ${formatPercent(src.pctDiffDay)} | Src 7d ${formatPercent(src.pctDiff7d)} | Dst 1d ${formatPercent(dst.pctDiffDay)} | Dst 7d ${formatPercent(dst.pctDiff7d)}`
          },
        },
      },
    ),
    columnHelper.display({
      id: 'miniCharts',
      header: 'Mini charts',
      cell: ({ row }) => <MiniChartsCell row={row.original} />,
      enableSorting: false,
      enableGlobalFilter: false,
      meta: {
        csvHeader: 'Mini charts',
        getCsvValue: ({ row }) => {
          const seriesPoints =
            row.original.rawDataPoints.length > 0
              ? row.original.rawDataPoints
              : row.original.dataPoints
          const lastPoint = seriesPoints.at(-1)

          if (!lastPoint) {
            return '-'
          }

          return `Count ${lastPoint.transferCount} | Src ${formatDollars(lastPoint.totalSrcValueUsd)} | Dst ${formatDollars(lastPoint.totalDstValueUsd)}`
        },
      },
    }),
    columnHelper.accessor('interpretation', {
      header: 'Interpretation',
      cell: ({ row }) =>
        row.original.interpretation.length > 0 ? (
          row.original.interpretation
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
