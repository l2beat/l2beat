import { formatInteger } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Line, LineChart } from 'recharts'
import type {
  ChartMeta,
  ChartProject,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
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
]

type Series = PrivacyAnonymitySetChartResponse['series'][number]
type Point = [number, ...number[]]
type ChartPoint = { timestamp: number } & Record<string, number>

interface Props {
  data: Point[] | undefined
  series: Series[] | undefined
  syncedUntil?: number
  isLoading: boolean
  project: ChartProject
  type: 'history' | 'holding-duration'
}

export function PrivacyAnonymitySetChart({
  data,
  series = [],
  syncedUntil,
  isLoading,
  project,
  type,
}: Props) {
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

  return (
    <ChartContainer
      data={chartData}
      meta={meta}
      isLoading={isLoading}
      project={project}
      interactiveLegend={{ dataKeys, onItemClick: toggleDataKey }}
    >
      <LineChart responsive data={chartData} margin={{ top: 20, right: 1 }}>
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((item) => (
          <Line
            key={item.id}
            dataKey={item.id}
            type="monotone"
            stroke={meta[item.id]?.color}
            strokeWidth={2}
            dot={false}
            hide={!dataKeys.includes(item.id)}
            connectNulls
            isAnimationActive={false}
          />
        ))}
        <ChartTooltip
          filterNull={false}
          content={<AnonymitySetTooltip type={type} />}
        />
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          syncedUntil={type === 'history' ? syncedUntil : undefined}
          yAxis={{
            domain: [0, 'auto'],
            allowDecimals: false,
            tickFormatter: (value) => formatInteger(Number(value)),
          }}
          xAxis={
            type === 'holding-duration'
              ? {
                  type: 'number',
                  domain: ['dataMin', 'dataMax'],
                  ticks: [7, 30, 90, 180, 365],
                  tickFormatter: (value) => `${value}d`,
                }
              : undefined
          }
        />
      </LineChart>
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
  payload,
  label,
  type,
}: CustomChartTooltipProps & {
  type: Props['type']
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="mb-2 font-medium text-label-value-14 text-secondary">
        {type === 'history'
          ? formatTimestamp(label, { longMonthName: true })
          : `${label}-day holding duration`}
      </div>
      <div className="flex flex-col gap-2">
        {payload.map((entry) => {
          if (
            typeof entry.dataKey !== 'string' ||
            entry.hide ||
            entry.type === 'none'
          ) {
            return null
          }
          const item = meta[entry.dataKey]
          if (!item) return null

          return (
            <div
              key={entry.dataKey}
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
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
