import type { Milestone } from '@l2beat/config'
import { formatInteger } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import {
  type ChartMeta,
  type ChartProject,
  useChart,
} from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import type { PrivacyAnonymitySetChartResponse } from '~/server/features/privacy/getPrivacyAnonymitySetChart'
import { formatTimestamp } from '~/utils/dates'

const COLORS = [
  'var(--chart-emerald)',
  'var(--chart-pink)',
  'var(--chart-cyan)',
  'var(--chart-yellow)',
  'var(--chart-sky)',
  'var(--chart-fuchsia)',
  'var(--chart-lime)',
  'var(--chart-orange)',
  'var(--chart-stacked-blue)',
  'var(--chart-yellow-lime)',
  'var(--chart-stacked-purple)',
]

type Series = PrivacyAnonymitySetChartResponse['series'][number]
type Point = [number, ...number[]]
type ChartPoint = { timestamp: number } & Record<string, number>

type Props = {
  data: Point[] | undefined
  series: Series[] | undefined
  isLoading: boolean
  project: ChartProject
} & (
  | { type: 'history'; milestones: Milestone[]; syncedUntil?: number }
  | { type: 'holding-duration'; durationLabel: string }
)

export function PrivacyAnonymitySetChart(props: Props) {
  const { data, series = [], isLoading, project } = props
  const meta = useMemo(() => getChartMeta(series), [series])
  const chartData = useMemo(
    () =>
      data?.map(([timestamp, ...values]) => {
        const point: ChartPoint = { timestamp }
        for (const [index, item] of series.entries()) {
          point[item.id] = values[index] ?? 0
        }
        return point
      }),
    [data, series],
  )
  const { dataKeys, toggleDataKey } = useChartDataKeys(meta)
  const formatTooltipTitle =
    props.type === 'history'
      ? (timestamp: number) => formatTimestamp(timestamp)
      : (days: number) => `${days}-day ${props.durationLabel}`

  return (
    <ChartContainer
      data={chartData}
      meta={meta}
      isLoading={isLoading}
      project={project}
      milestones={props.type === 'history' ? props.milestones : undefined}
      interactiveLegend={{ dataKeys, onItemClick: toggleDataKey }}
      legend
    >
      <TimeSeriesChart
        data={chartData}
        ariaLabel="Anonymity set"
        series={series.map((item) => ({
          key: item.id,
          curve: 'monotone',
          stroke: meta[item.id]?.color,
          strokeWidth: 2,
          connectNulls: true,
          hidden: !dataKeys.includes(item.id),
        }))}
        syncedUntil={props.type === 'history' ? props.syncedUntil : undefined}
        yAxis={{
          domain: 'zero',
          integer: true,
          format: formatInteger,
        }}
        xAxis={
          props.type === 'holding-duration'
            ? {
                // No 7d: it sits on the plot's left edge and would overflow.
                ticks: [30, 90, 180, 365],
                format: (value) => `${value}d`,
              }
            : undefined
        }
        renderTooltip={(row, keys) => (
          <AnonymitySetTooltip
            row={row}
            keys={keys}
            formatTitle={formatTooltipTitle}
          />
        )}
      />
    </ChartContainer>
  )
}

function getChartMeta(series: Series[]): ChartMeta {
  return Object.fromEntries(
    series.map((item, index) => [
      item.id,
      {
        label: item.label,
        color: COLORS[index % COLORS.length] ?? 'var(--chart-emerald)',
        indicatorType: { shape: 'line' as const },
      },
    ]),
  )
}

function AnonymitySetTooltip({
  row,
  keys,
  formatTitle,
}: {
  row: ChartPoint
  keys: string[]
  formatTitle: (label: number) => string
}) {
  const { meta } = useChart()

  return (
    <ChartTooltipWrapper>
      <div className="mb-2 font-medium text-label-value-14 text-secondary">
        {formatTitle(row.timestamp)}
      </div>
      <div className="flex flex-col gap-2">
        {sortAnonymitySetTooltipEntries(getTooltipEntries(row, keys)).map(
          (entry) => {
            const item = meta[entry.name]
            if (!item) return null

            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-6"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    type={item.indicatorType}
                    backgroundColor={item.color}
                  />
                  <span className="font-medium text-label-value-14">
                    {item.label}
                  </span>
                </div>
                <span className="font-medium text-label-value-15 tabular-nums">
                  {formatInteger(Number(entry.value ?? 0))}
                </span>
              </div>
            )
          },
        )}
      </div>
    </ChartTooltipWrapper>
  )
}

export function sortAnonymitySetTooltipEntries<T extends { value?: unknown }>(
  entries: readonly T[],
): T[] {
  return entries.toSorted((a, b) => {
    const aValue = toFiniteNumber(a.value)
    const bValue = toFiniteNumber(b.value)

    return bValue - aValue
  })
}

function toFiniteNumber(value: unknown): number {
  const numericValue = Number(value ?? 0)
  return Number.isFinite(numericValue) ? numericValue : Number.NEGATIVE_INFINITY
}
