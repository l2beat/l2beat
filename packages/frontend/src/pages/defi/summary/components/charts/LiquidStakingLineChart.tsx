import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import type { DefiLiquidStakingChartProject } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import type { LiquidStakingChartPoint } from '~/server/features/defi/liquidStakingCharts/liquidStakingMetrics'
import { formatTimestamp } from '~/utils/dates'

/** A context series drawn as a shaded area behind the lines, on its own right axis. */
export interface LiquidStakingChartBackground {
  key: string
  label: string
  /** One value per data point, in million ETH. */
  values: (number | null)[]
  color: string
  formatAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
}

interface Props {
  projects: DefiLiquidStakingChartProject[]
  colors: Record<string, string>
  data: LiquidStakingChartPoint[]
  ariaLabel: string
  formatYAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
  background?: LiquidStakingChartBackground
}

/**
 * One line per project over the shared daily grid, with the clickable legend
 * used by the privacy charts and the tooltip used by the compare charts.
 */
export function LiquidStakingLineChart({
  projects,
  colors,
  data,
  ariaLabel,
  formatYAxisLabel,
  formatTooltipValue,
  background,
}: Props) {
  const points = useMemo(
    () =>
      background
        ? data.map((point, index) => ({
            ...point,
            [background.key]: background.values[index] ?? null,
          }))
        : data,
    [data, background],
  )
  const chartMeta = useMemo<ChartMeta>(() => {
    const meta = projects.reduce<ChartMeta>((acc, project) => {
      acc[project.id] = {
        label: (
          <span className="inline-flex items-center gap-1">
            <img
              src={project.icon}
              alt=""
              width={14}
              height={14}
              className="size-3.5 rounded-full"
            />
            {project.name}
          </span>
        ),
        color: colors[project.id] ?? 'var(--secondary)',
        indicatorType: {
          shape: 'line',
          strokeDasharray: project.benchmark ? '5 5' : undefined,
        },
      }
      return acc
    }, {})
    if (background) {
      meta[background.key] = {
        label: background.label,
        color: background.color,
        indicatorType: { shape: 'square' },
      }
    }
    return meta
  }, [projects, colors, background])

  // The stake axis spans whole 5M steps around the data, with one step of
  // room below so the area does not sit on the lines' axis.
  const backgroundDomain = useMemo(() => {
    const values = background?.values.filter(
      (value): value is number => value !== null,
    )
    if (!values || values.length === 0) return undefined
    return [
      Math.floor(Math.min(...values) / 5) * 5 - 5,
      Math.ceil(Math.max(...values) / 5) * 5,
    ] as const
  }, [background])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const series: ChartSeries<string, LiquidStakingChartPoint>[] = [
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
    ...projects.map((project) => ({
      key: project.id,
      stroke: chartMeta[project.id]?.color,
      strokeDasharray: project.benchmark ? '5 5' : undefined,
    })),
  ]

  return (
    <ChartContainer
      data={points}
      meta={chartMeta}
      isLoading={false}
      isPlaceholderData={false}
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
        data={points}
        series={series}
        ariaLabel={ariaLabel}
        yAxis={{ tickCount: 4, format: formatYAxisLabel }}
        rightAxis={
          background && backgroundDomain
            ? {
                domain: backgroundDomain,
                tickCount: 3,
                format: background.formatAxisLabel,
              }
            : undefined
        }
        renderTooltip={(row, keys) => (
          <CustomTooltip
            row={row}
            keys={keys}
            formatValue={formatTooltipValue}
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
  background,
}: {
  row: LiquidStakingChartPoint
  keys: string[]
  formatValue: (value: number) => string
  background?: LiquidStakingChartBackground
}) {
  const entries = getTooltipEntries(row, keys, { skipNull: true })
  const lines = entries
    .filter((entry) => entry.name !== background?.key)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
  const stake = entries.find((entry) => entry.name === background?.key)
  if (lines.length === 0 && !stake) return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatTimestamp(row.timestamp)}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {[...lines, ...(stake ? [stake] : [])].map((entry) => (
            <ChartTooltipRow
              key={entry.name}
              name={entry.name}
              gap="gap-x-3"
              wrapLabel={false}
            >
              <ChartTooltipValue
                value={entry.value}
                format={
                  entry.name === background?.key
                    ? background.formatTooltipValue
                    : formatValue
                }
                className="text-primary tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
