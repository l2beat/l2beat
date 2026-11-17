import type { Milestone } from '@l2beat/config'
import {
  formatCurrency,
  formatInteger,
  formatSeconds,
  UnixTime,
} from '@l2beat/shared-pure'
import { scaleLog, scaleSymlog } from 'd3-scale'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipRows,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import {
  type ChartReferenceArea,
  type ChartReferenceDot,
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { AREA_FILL_OPACITY } from '~/components/core/chart/tint'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type {
  InteropHistoryData,
  InteropHistoryPoint,
} from '~/server/features/layer2s/interop/history/types'
import { formatRange } from '~/utils/dates'
import type {
  HistoryCappedLane,
  HistoryTokenDay,
} from '../utils/applyHistoryExclusions'
import type {
  HistoryChart,
  HistoryChartRow,
  HistoryValueFormat,
} from '../utils/buildHistoryChart'
import type { HistoryZeroDay } from '../utils/findZeroDays'
import { getShiftedWindow } from '../utils/getShiftedWindow'
import { describeShiftedWindow } from './HistoryDataQuality'

interface Props {
  data: InteropHistoryData | undefined
  chart: HistoryChart | undefined
  cappedLanes: HistoryCappedLane[]
  tokenDays: HistoryTokenDay[]
  zeroDays: HistoryZeroDay[]
  scale: 'linear' | 'log'
  excludeBlocked: boolean
  milestones: Milestone[]
  isLoading: boolean
  isPlaceholderData: boolean
}

export function InteropHistoryChart({
  data,
  chart,
  cappedLanes,
  tokenDays,
  zeroDays,
  scale,
  excludeBlocked,
  milestones,
  isLoading,
  isPlaceholderData,
}: Props) {
  // A log axis has no zero. A stack or a signed series gets a symmetric log
  // axis, linear near zero; the rest drop zero points instead.
  const symmetric =
    !!chart && (chart.signed || chart.series.some((s) => s.stack))
  const logScale =
    scale === 'log'
      ? symmetric
        ? () => scaleSymlog().constant(chart?.format === 'usd' ? 1e6 : 10)
        : scaleLog
      : undefined
  const rows =
    scale === 'log' && !symmetric
      ? chart?.rows.map((row) => ({
          ...row,
          values: Object.fromEntries(
            Object.entries(row.values).map(([k, v]) => [
              k,
              v !== null && v > 0 ? v : null,
            ]),
          ),
        }))
      : chart?.rows
  const meta: ChartMeta = Object.fromEntries(
    (chart?.series ?? []).map((s) => [
      s.key,
      {
        label: s.label,
        color: s.color,
        indicatorType: s.fill
          ? { shape: 'square' as const }
          : {
              shape: 'line' as const,
              strokeDasharray: s.dashed ? '4 3' : undefined,
            },
      },
    ]),
  )
  const series: ChartSeries<string, HistoryChartRow>[] = (
    chart?.series ?? []
  ).map((s) => ({
    key: s.key,
    value: (row) => row.values[s.key],
    stroke: s.color,
    fill: s.fill ? s.color : undefined,
    fillOpacity: s.fill ? (s.stack ? 0.5 : AREA_FILL_OPACITY) : undefined,
    strokeDasharray: s.dashed ? '4 3' : undefined,
    stack: s.stack,
    isolatedDots: {},
  }))

  const step = data?.resolution === 'hourly' ? UnixTime.HOUR : UnixTime.DAY
  const referenceAreas: ChartReferenceArea[] = (data?.points ?? []).flatMap(
    (point) => {
      const area = {
        x1: point.timestamp - step / 2,
        x2: point.timestamp + step / 2,
      }
      if (point.snapshot === null) return [area]
      if (point.isBlocked) {
        return [
          {
            ...area,
            fill: 'var(--negative)',
            fillOpacity: excludeBlocked ? 0.12 : 0.06,
          },
        ]
      }
      return []
    },
  )

  const inRange = new Map((rows ?? []).map((row) => [row.point, row]))
  const top = (row: HistoryChartRow) => {
    const stacked = (chart?.series ?? []).filter((s) => s.stack)
    const stackTop = stacked.reduce(
      (sum, s) => sum + (row.values[s.key] ?? 0),
      0,
    )
    const highest = Math.max(
      ...Object.values(row.values).map((v) => v ?? 0),
      stackTop,
    )
    return highest
  }
  const referenceDots: ChartReferenceDot[] = [
    ...dotsAt(
      cappedLanes.map((l) => l.point),
      'var(--negative)',
    ),
    ...dotsAt(
      tokenDays.map((t) => t.point),
      'var(--warning)',
    ),
    ...dotsAt(
      zeroDays.map((z) => z.point),
      'var(--secondary)',
    ),
  ]
  function dotsAt(points: number[], fill: string): ChartReferenceDot[] {
    return [...new Set(points)].flatMap((point) => {
      const row = inRange.get(point)
      if (!row) return []
      return [
        {
          x: row.timestamp,
          y: top(row),
          r: 4,
          fill,
          stroke: 'var(--surface-primary)',
          strokeWidth: 2,
        },
      ]
    })
  }

  const format = chart?.format ?? 'usd'
  return (
    <div className="h-[420px]">
      <ChartContainer
        size="fill"
        data={rows}
        meta={meta}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        milestones={milestones}
        legend
      >
        <TimeSeriesChart
          data={rows}
          series={series}
          ariaLabel="Interop history"
          yAxis={{
            format: (value) => formatValue(value, format, true),
            scale: logScale,
            domain: logScale === scaleLog ? 'auto' : 'zero',
          }}
          referenceAreas={referenceAreas}
          referenceDots={referenceDots}
          renderTooltip={(row, keys) => (
            <HistoryTooltip
              row={row}
              keys={keys}
              format={format}
              point={data?.points[row.point]}
              points={data?.points ?? []}
              index={row.point}
              cappedLanes={cappedLanes.filter((l) => l.point === row.point)}
              tokenDays={tokenDays.filter((t) => t.point === row.point)}
              zeroDays={zeroDays.filter((z) => z.point === row.point)}
              names={data?.protocols}
              excludeBlocked={excludeBlocked}
            />
          )}
        />
      </ChartContainer>
    </div>
  )
}

function HistoryTooltip({
  row,
  keys,
  format,
  point,
  points,
  index,
  cappedLanes,
  tokenDays,
  zeroDays,
  names,
  excludeBlocked,
}: {
  row: HistoryChartRow
  keys: string[]
  format: HistoryValueFormat
  point: InteropHistoryPoint | undefined
  points: InteropHistoryPoint[]
  index: number | undefined
  cappedLanes: HistoryCappedLane[]
  tokenDays: HistoryTokenDay[]
  zeroDays: HistoryZeroDay[]
  names: InteropHistoryData['protocols'] | undefined
  excludeBlocked: boolean
}) {
  const name = (id: string) => names?.find((p) => p.id === id)?.name ?? id
  const snapshot = point?.snapshot ?? null
  const notes: string[] = []
  if (snapshot === null) notes.push('No snapshot for this point.')
  else {
    const window =
      point && index !== undefined ? getShiftedWindow(points, index) : undefined
    if (window) notes.push(`Shifted window: ${describeShiftedWindow(window)}`)
    if (point?.isBlocked) {
      notes.push(
        excludeBlocked
          ? 'Blocked by the promotion rules; excluded.'
          : 'Blocked by the promotion rules; shown.',
      )
    }
    if (point && point.carriedLanes > 0) {
      notes.push(`${point.carriedLanes} lanes copied from an older snapshot.`)
    }
    if (point && point.partialLanes > 0) {
      notes.push(`${point.partialLanes} lanes computed while syncers lagged.`)
    }
  }

  return (
    <ChartTooltipWrapper>
      <div className="flex w-52 flex-col sm:w-72">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(
            (snapshot ?? row.timestamp) - UnixTime.DAY,
            snapshot ?? row.timestamp,
          )}
        </div>
        <ChartTooltipRows className="flex flex-col gap-2">
          {keys.map((key) => (
            <ChartTooltipRow key={key} name={key}>
              <ChartTooltipValue
                value={row.values[key] ?? null}
                format={(v) => formatValue(v, format, false)}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </ChartTooltipRows>
        {(notes.length > 0 ||
          cappedLanes.length > 0 ||
          tokenDays.length > 0 ||
          zeroDays.length > 0) && (
          <>
            <HorizontalSeparator className="my-2" />
            <ul className="flex flex-col gap-1 font-medium text-label-value-13 text-secondary">
              {notes.map((note) => (
                <li key={note}>{note}</li>
              ))}
              {cappedLanes.slice(0, 3).map((l) => (
                <li
                  key={`${l.id}-${l.srcChain}-${l.dstChain}`}
                  className="text-negative"
                >
                  Lane over the cap{l.excluded ? ', excluded' : ''}:{' '}
                  {formatCurrency(l.volume, 'usd')} on {name(l.id)} {l.srcChain}{' '}
                  → {l.dstChain}, mostly {l.token}
                </li>
              ))}
              {cappedLanes.length > 3 && (
                <li>and {cappedLanes.length - 3} more lanes over the cap</li>
              )}
              {tokenDays.map((t) => (
                <li key={`${t.id}-${t.token}`} className="text-warning-text">
                  Unusual token day{t.excluded ? ', excluded' : ''}:{' '}
                  {formatCurrency(t.volume, 'usd')} of {t.token} on {name(t.id)}
                  , usually {formatCurrency(t.baseline, 'usd')}
                </li>
              ))}
              {zeroDays.map((z) => (
                <li key={z.id}>
                  {name(z.id)}: no transfers, usually {formatInteger(z.usual)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}

export function formatValue(
  value: number,
  format: HistoryValueFormat,
  axis: boolean,
) {
  switch (format) {
    case 'usd':
      return formatCurrency(value, 'usd', { decimals: axis ? 0 : 2 })
    case 'count':
      return formatInteger(value)
    case 'duration':
      return formatSeconds(value)
  }
}
