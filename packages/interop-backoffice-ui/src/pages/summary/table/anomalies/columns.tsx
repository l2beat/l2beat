import type { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'
import { SortableHeader } from '~/components/table/SortableHeader'
import { cn } from '~/utils/cn'
import { formatDollars } from '../transfers/utils'
import type { SummaryAnomalyRow } from '../types'
import { Sparkline } from './Sparkline'
import {
  buildAnomalyDetailsPath,
  formatCount,
  formatGapPercent,
  formatPercent,
  formatSignedDiff,
  getGapColorClass,
  getPercentColor,
  getSummaryValues,
} from './utils'

const VALUE_DIFF_ALERT_THRESHOLD_PERCENT = 5

function maxOrZero(values: number[]) {
  if (values.length === 0) {
    return 0
  }
  return Math.max(...values)
}

function MetricLine(props: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'whitespace-nowrap text-[11px] text-muted-foreground',
        props.className,
      )}
    >
      {props.children}
    </div>
  )
}

function DeltaCell(props: {
  diffDay: number | null
  diff7d: number | null
  pctDiffDay: number | null
  pctDiff7d: number | null
}) {
  return (
    <>
      <MetricLine>
        1d {formatSignedDiff(props.diffDay, 0)} (
        <span
          className={cn('font-semibold', getPercentColor(props.pctDiffDay))}
        >
          {formatPercent(props.pctDiffDay)}
        </span>
        )
      </MetricLine>
      <MetricLine>
        7d {formatSignedDiff(props.diff7d, 0)} (
        <span className={cn('font-semibold', getPercentColor(props.pctDiff7d))}>
          {formatPercent(props.pctDiff7d)}
        </span>
        )
      </MetricLine>
    </>
  )
}

function PercentBySourceCell(props: {
  srcPctDay: number | null
  srcPct7d: number | null
  dstPctDay: number | null
  dstPct7d: number | null
}) {
  return (
    <>
      <MetricLine>
        Src 1d{' '}
        <span className={cn('font-semibold', getPercentColor(props.srcPctDay))}>
          {formatPercent(props.srcPctDay)}
        </span>{' '}
        · 7d{' '}
        <span className={cn('font-semibold', getPercentColor(props.srcPct7d))}>
          {formatPercent(props.srcPct7d)}
        </span>
      </MetricLine>
      <MetricLine>
        Dst 1d{' '}
        <span className={cn('font-semibold', getPercentColor(props.dstPctDay))}>
          {formatPercent(props.dstPctDay)}
        </span>{' '}
        · 7d{' '}
        <span className={cn('font-semibold', getPercentColor(props.dstPct7d))}>
          {formatPercent(props.dstPct7d)}
        </span>
      </MetricLine>
    </>
  )
}

function MiniChartsCell(props: { row: SummaryAnomalyRow }) {
  const seriesPoints =
    props.row.rawDataPoints.length > 0
      ? props.row.rawDataPoints
      : props.row.dataPoints
  const countValues = seriesPoints.map((point) => point.transferCount)
  const srcVolumeValues = seriesPoints.map((point) => point.totalSrcValueUsd)
  const dstVolumeValues = seriesPoints.map((point) => point.totalDstValueUsd)

  const countDomain = {
    min: 0,
    max: maxOrZero(countValues),
  }
  const volumeDomain = {
    min: 0,
    max: maxOrZero([...srcVolumeValues, ...dstVolumeValues]),
  }

  return (
    <div className="min-w-[140px]">
      <MetricLine>
        Count <span className="font-semibold text-blue-600">●</span>
      </MetricLine>
      <div className="rounded bg-slate-50">
        <Sparkline values={countValues} color="#2563eb" domain={countDomain} />
      </div>
      <MetricLine>
        Vol <span className="font-semibold text-violet-600">S</span> /
        <span className="font-semibold text-orange-500"> D</span>
      </MetricLine>
      <div className="relative rounded bg-slate-50">
        <Sparkline
          values={srcVolumeValues}
          color="#7c3aed"
          domain={volumeDomain}
        />
        <div className="absolute inset-0">
          <Sparkline
            values={dstVolumeValues}
            color="#f97316"
            domain={volumeDomain}
          />
        </div>
      </div>
    </div>
  )
}

export const anomaliesColumns: ColumnDef<SummaryAnomalyRow>[] = [
  {
    id: 'timestamp',
    accessorFn: (row) => row.timestamp,
    header: (props) => <SortableHeader {...props} label="Day (UTC)" />,
    cell: ({ row }) => (
      <span className="font-mono text-xs">{row.original.timestamp}</span>
    ),
    meta: {
      csvHeader: 'Day (UTC)',
    },
  },
  {
    accessorKey: 'id',
    header: (props) => <SortableHeader {...props} label="Transfer ID" />,
    cell: ({ row }) => (
      <Link
        to={buildAnomalyDetailsPath(row.original.id)}
        className="font-mono text-xs underline underline-offset-4 hover:text-primary"
      >
        {row.original.id}
      </Link>
    ),
    meta: {
      csvHeader: 'Transfer ID',
    },
  },
  {
    id: 'count',
    accessorFn: (row) => row.counts.last,
    header: (props) => <SortableHeader {...props} label="Count" />,
    cell: ({ row }) => formatCount(row.original.counts.last),
    meta: {
      csvHeader: 'Count',
    },
  },
  {
    id: 'countDelta',
    accessorFn: (row) => {
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
    header: (props) => <SortableHeader {...props} label="Count Δ" />,
    cell: ({ row }) => {
      const summary = getSummaryValues(
        row.original.counts.last,
        row.original.counts.prevDay,
        row.original.counts.prev7d,
      )
      return (
        <DeltaCell
          diffDay={summary.diffDay}
          diff7d={summary.diff7d}
          pctDiffDay={summary.pctDiffDay}
          pctDiff7d={summary.pctDiff7d}
        />
      )
    },
    meta: {
      csvHeader: 'Count delta',
      csvValue: ({ row }) => {
        const summary = getSummaryValues(
          row.original.counts.last,
          row.original.counts.prevDay,
          row.original.counts.prev7d,
        )
        return `1d ${formatSignedDiff(summary.diffDay, 0)} (${formatPercent(summary.pctDiffDay)}) | 7d ${formatSignedDiff(summary.diff7d, 0)} (${formatPercent(summary.pctDiff7d)})`
      },
    },
  },
  {
    id: 'volume',
    accessorFn: (row) =>
      Math.max(row.srcVolume.valueUsd.last, row.dstVolume.valueUsd.last),
    header: (props) => <SortableHeader {...props} label="Volume (USD)" />,
    cell: ({ row }) => (
      <>
        <MetricLine>
          Src {formatDollars(row.original.srcVolume.valueUsd.last)}
        </MetricLine>
        <MetricLine>
          Dst {formatDollars(row.original.dstVolume.valueUsd.last)}
        </MetricLine>
      </>
    ),
    meta: {
      csvHeader: 'Volume (USD)',
      csvValue: ({ row }) =>
        `Src ${formatDollars(row.original.srcVolume.valueUsd.last)} | Dst ${formatDollars(row.original.dstVolume.valueUsd.last)}`,
    },
  },
  {
    id: 'volumeDelta',
    accessorFn: (row) => {
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
    header: (props) => <SortableHeader {...props} label="Volume Δ%" />,
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
    meta: {
      csvHeader: 'Volume Δ%',
      csvValue: ({ row }) => {
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
  {
    id: 'srcDstDiff',
    accessorFn: (row) => row.srcDstDiff.lastPercent ?? -1,
    header: (props) => <SortableHeader {...props} label="Src/Dst diff %" />,
    cell: ({ row }) => (
      <>
        <div
          className={cn(
            'font-semibold text-[11px]',
            getGapColorClass(
              row.original.srcDstDiff.lastPercent,
              VALUE_DIFF_ALERT_THRESHOLD_PERCENT,
            ),
            row.original.srcDstDiff.isHigh && 'font-bold',
          )}
        >
          Now {formatGapPercent(row.original.srcDstDiff.lastPercent)}
        </div>
        <MetricLine>
          1d {formatGapPercent(row.original.srcDstDiff.prevDayPercent)} · 7d{' '}
          {formatGapPercent(row.original.srcDstDiff.prev7dPercent)}
        </MetricLine>
      </>
    ),
    meta: {
      csvHeader: 'Src/Dst diff %',
      csvValue: ({ row }) =>
        `Now ${formatGapPercent(row.original.srcDstDiff.lastPercent)} | 1d ${formatGapPercent(row.original.srcDstDiff.prevDayPercent)} | 7d ${formatGapPercent(row.original.srcDstDiff.prev7dPercent)}`,
    },
  },
  {
    id: 'avgVolumePerTx',
    accessorFn: (row) =>
      Math.max(
        row.srcVolume.avgValuePerTransfer.last ?? 0,
        row.dstVolume.avgValuePerTransfer.last ?? 0,
      ),
    header: (props) => <SortableHeader {...props} label="Avg vol/tx" />,
    cell: ({ row }) => (
      <>
        <MetricLine>
          Src {formatDollars(row.original.srcVolume.avgValuePerTransfer.last)}
        </MetricLine>
        <MetricLine>
          Dst {formatDollars(row.original.dstVolume.avgValuePerTransfer.last)}
        </MetricLine>
      </>
    ),
    meta: {
      csvHeader: 'Avg vol/tx',
      csvValue: ({ row }) =>
        `Src ${formatDollars(row.original.srcVolume.avgValuePerTransfer.last)} | Dst ${formatDollars(row.original.dstVolume.avgValuePerTransfer.last)}`,
    },
  },
  {
    id: 'avgVolumePerTxDelta',
    accessorFn: (row) => {
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
    header: (props) => <SortableHeader {...props} label="Avg vol/tx Δ%" />,
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
    meta: {
      csvHeader: 'Avg vol/tx Δ%',
      csvValue: ({ row }) => {
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
  {
    id: 'trend',
    accessorFn: (row) => row.dataPoints.length,
    header: (props) => <SortableHeader {...props} label="Mini charts" />,
    cell: ({ row }) => <MiniChartsCell row={row.original} />,
    meta: {
      csvHeader: 'Mini charts',
      csvValue: () => '(chart)',
    },
  },
  {
    id: 'interpretation',
    accessorFn: (row) => row.interpretation || '-',
    header: (props) => <SortableHeader {...props} label="Interpretation" />,
    cell: ({ row }) => (
      <div className="max-w-[420px] whitespace-normal break-words text-xs">
        {row.original.interpretation || '-'}
      </div>
    ),
    meta: {
      csvHeader: 'Interpretation',
      csvValue: ({ row }) => row.original.interpretation || '-',
    },
  },
]
