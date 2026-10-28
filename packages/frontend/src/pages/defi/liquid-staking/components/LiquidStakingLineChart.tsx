import { useMemo } from 'react'
import { Area, ComposedChart, Line, YAxis } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import {
  ChartDataIndicator,
  type ChartDataIndicatorType,
} from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { formatTimestamp } from '~/utils/dates'

export interface LiquidStakingChartSeries {
  key: string
  label: React.ReactNode
  color: string
  dashed?: boolean
}

/** A context series drawn as a shaded area behind the lines, on its own right axis. */
export interface LiquidStakingChartBackground {
  key: string
  label: string
  color: string
  formatAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
}

export type LiquidStakingChartData = ({ timestamp: number } & Record<
  string,
  number | null
>)[]

interface Props {
  series: LiquidStakingChartSeries[]
  data: LiquidStakingChartData | undefined
  isLoading: boolean
  formatYAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
  background?: LiquidStakingChartBackground
}

/** One line per series over a daily grid, with an optional shaded background series. */
export function LiquidStakingLineChart({
  series,
  data,
  isLoading,
  formatYAxisLabel,
  formatTooltipValue,
  background,
}: Props) {
  const chartMeta = useMemo<ChartMeta>(() => {
    const meta: ChartMeta = {}
    for (const line of series) {
      meta[line.key] = {
        label: line.label,
        color: line.color,
        indicatorType: {
          shape: 'line',
          strokeDasharray: line.dashed ? '5 5' : undefined,
        },
      }
    }
    if (background) {
      meta[background.key] = {
        label: background.label,
        color: background.color,
        indicatorType: { shape: 'square' },
      }
    }
    return meta
  }, [series, background])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
        disableOnboarding: true,
      }}
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      <ComposedChart responsive data={data} margin={{ top: 20, right: 1 }}>
        <ChartLegendToggleAll
          showAllSelected={showAllSelected}
          onToggleAll={toggleAllDataKeys}
        />
        {background && (
          <>
            <Area
              yAxisId="right"
              dataKey={background.key}
              hide={!dataKeys.includes(background.key)}
              stroke="none"
              fill={background.color}
              fillOpacity={0.15}
              isAnimationActive={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={background.formatAxisLabel}
              tickLine={false}
              axisLine={false}
              mirror
              tickCount={3}
              dy={-10}
              tick={{ width: 100 }}
            />
          </>
        )}
        {series.map((line) => (
          <Line
            key={line.key}
            yAxisId="left"
            dataKey={line.key}
            hide={!dataKeys.includes(line.key)}
            stroke={line.color}
            strokeDasharray={line.dashed ? '5 5' : undefined}
            dot={false}
            isAnimationActive={false}
          />
        ))}
        <ChartCommonComponents
          data={data}
          isLoading={isLoading}
          yAxis={{
            yAxisId: 'left',
            tickCount: 4,
            tickFormatter: (value) => formatYAxisLabel(Number(value)),
          }}
          syncedUntil={undefined}
        />
        <ChartTooltip
          content={
            <CustomTooltip
              formatValue={formatTooltipValue}
              background={background}
            />
          }
        />
      </ComposedChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  payload,
  label,
  formatValue,
  background,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  background?: LiquidStakingChartBackground
}) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  const visible = payload.filter(
    (entry) =>
      entry.type !== 'none' &&
      !entry.hide &&
      entry.value !== null &&
      entry.value !== undefined,
  )
  if (visible.length === 0) return null

  const lines = visible
    .filter((entry) => entry.name !== background?.key)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
  const backgroundEntry = visible.find(
    (entry) => entry.name === background?.key,
  )

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(label, { mode: 'date', longMonthName: true })}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {lines.map((entry) => {
            const config = entry.name ? meta[entry.name] : undefined
            if (!config || entry.value == null) return null
            return (
              <TooltipRow
                key={entry.name}
                color={config.color}
                indicator={config.indicatorType ?? { shape: 'line' }}
                label={config.label}
                value={formatValue(entry.value)}
              />
            )
          })}
          {background && backgroundEntry?.value != null && (
            <TooltipRow
              color={background.color}
              indicator={{ shape: 'square' }}
              label={background.label}
              value={background.formatTooltipValue(backgroundEntry.value)}
            />
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function TooltipRow({
  color,
  indicator,
  label,
  value,
}: {
  color: string | undefined
  indicator: ChartDataIndicatorType
  label: React.ReactNode
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-x-3">
      <div className="flex items-center gap-1">
        <ChartDataIndicator backgroundColor={color} type={indicator} />
        <span className="font-medium text-label-value-14">{label}</span>
      </div>
      <span className="whitespace-nowrap font-medium text-label-value-15 text-primary tabular-nums">
        {value}
      </span>
    </div>
  )
}
