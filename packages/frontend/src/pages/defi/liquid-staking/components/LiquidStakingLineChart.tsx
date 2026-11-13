import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'

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
  isPlaceholderData: boolean
  ariaLabel: string
  formatYAxisLabel: (value: number) => string
  formatTooltipValue: (value: number, key: string, timestamp: number) => string
  formatTooltipDate: (timestamp: number) => string
  background?: LiquidStakingChartBackground
}

/** One line per series over a daily grid, with an optional shaded background series. */
export function LiquidStakingLineChart({
  series,
  data,
  isLoading,
  isPlaceholderData,
  ariaLabel,
  formatYAxisLabel,
  formatTooltipValue,
  formatTooltipDate,
  background,
}: Props) {
  // The legend follows the meta's order. The dashed benchmark and the shaded
  // background lead it, so their keys stay in view when the project keys
  // overflow the strip.
  const chartMeta = useMemo<ChartMeta>(() => {
    const meta: ChartMeta = {}
    const addLine = (line: LiquidStakingChartSeries) => {
      meta[line.key] = {
        label: line.label,
        color: line.color,
        indicatorType: {
          shape: 'line',
          strokeDasharray: line.dashed ? '5 5' : undefined,
        },
      }
    }
    series.filter((line) => line.dashed).forEach(addLine)
    if (background) {
      meta[background.key] = {
        label: background.label,
        color: background.color,
        indicatorType: { shape: 'square' },
      }
    }
    series.filter((line) => !line.dashed).forEach(addLine)
    return meta
  }, [series, background])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const chartSeries: ChartSeries<string, LiquidStakingChartData[number]>[] = [
    ...(background
      ? [
          {
            key: background.key,
            fill: background.color,
            fillOpacity: 0.15,
            axis: 'right' as const,
            activeDot: false,
          },
        ]
      : []),
    ...series.map((line) => ({
      key: line.key,
      stroke: line.color,
      strokeDasharray: line.dashed ? '5 5' : undefined,
    })),
  ]

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      isPlaceholderData={isPlaceholderData}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
        disableOnboarding: true,
      }}
      legend
      legendLeading={
        <ChartLegendToggleAll
          showAllSelected={showAllSelected}
          onToggleAll={toggleAllDataKeys}
        />
      }
    >
      <TimeSeriesChart
        data={data}
        series={chartSeries}
        ariaLabel={ariaLabel}
        yAxis={{ format: formatYAxisLabel, tickCount: 4 }}
        rightAxis={
          background
            ? // The same count as the left axis puts both sets of labels
              // on the same gridlines.
              { format: background.formatAxisLabel, tickCount: 4 }
            : undefined
        }
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            keys={keys}
            formatValue={formatTooltipValue}
            formatDate={formatTooltipDate}
            background={background}
          />
        )}
      />
    </ChartContainer>
  )
}

function CustomTooltip({
  row,
  keys,
  formatValue,
  formatDate,
  background,
}: {
  row: LiquidStakingChartData[number]
  keys: string[]
  formatValue: Props['formatTooltipValue']
  formatDate: Props['formatTooltipDate']
  background?: LiquidStakingChartBackground
}) {
  const label = row.timestamp
  // Hidden series are not in `keys`.
  const visible = getTooltipEntries(row, keys, { skipNull: true })
  if (visible.length === 0) return null

  const lines = visible
    .filter((entry) => entry.name !== background?.key)
    .sort((a, b) => b.value - a.value)
  const backgroundEntry = visible.find(
    (entry) => entry.name === background?.key,
  )

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatDate(label)}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {lines.map((entry) => (
            <TooltipRow
              key={entry.name}
              name={entry.name}
              value={formatValue(entry.value, entry.name, label)}
            />
          ))}
          {background && backgroundEntry && (
            // A different unit on the right axis, set apart like that axis.
            <div className="mt-1 border-divider border-t pt-2">
              <TooltipRow
                name={background.key}
                value={background.formatTooltipValue(backgroundEntry.value)}
              />
            </div>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function TooltipRow({ name, value }: { name: string; value: string }) {
  return (
    <ChartTooltipRow name={name} gap="gap-x-3" wrapLabel={false}>
      <span className="whitespace-nowrap font-medium text-label-value-15 text-primary tabular-nums">
        {value}
      </span>
    </ChartTooltipRow>
  )
}
