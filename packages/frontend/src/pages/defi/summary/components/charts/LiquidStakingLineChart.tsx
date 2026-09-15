import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Bar, BarChart, Line, LineChart, type YAxisProps } from 'recharts'
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
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import type { DefiLiquidStakingChartProject } from '~/server/features/defi/liquidStakingCharts/getDefiLiquidStakingCharts'
import { formatTimestamp } from '~/utils/dates'

/** A timestamp plus one value per project id. */
export interface LiquidStakingChartPoint {
  timestamp: number
  [projectId: string]: number | null
}

interface Props {
  projects: DefiLiquidStakingChartProject[]
  colors: Record<string, string>
  data: LiquidStakingChartPoint[]
  formatYAxisLabel: (value: number) => string
  /** Receives the plotted value, the whole point and the project id. */
  formatTooltipValue: (
    value: number,
    point: LiquidStakingChartPoint,
    projectId: string,
  ) => string
  /** Legend label override per project id, e.g. to mark a series as a floor. */
  labels?: Record<string, ReactNode>
  yAxis?: Pick<YAxisProps, 'scale' | 'domain' | 'allowDataOverflow' | 'ticks'>
  /** Lines over the daily grid (default) or one bar per bucket and project. */
  chartType?: 'line' | 'bar'
  /** Tooltip heading for a point; defaults to the full date. */
  formatLabel?: (timestamp: number) => string
}

/**
 * One line per project over the shared daily grid, with the clickable legend
 * used by the privacy charts and the tooltip used by the compare charts.
 */
export function LiquidStakingLineChart({
  projects,
  colors,
  data,
  formatYAxisLabel,
  formatTooltipValue,
  labels,
  yAxis,
  chartType = 'line',
  formatLabel = (timestamp) =>
    formatTimestamp(timestamp, { mode: 'date', longMonthName: true }),
}: Props) {
  const chartMeta = useMemo<ChartMeta>(
    () =>
      projects.reduce<ChartMeta>((acc, project) => {
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
              {labels?.[project.id] ?? project.name}
            </span>
          ),
          color: colors[project.id] ?? 'var(--secondary)',
          indicatorType: { shape: chartType === 'bar' ? 'square' : 'line' },
        }
        return acc
      }, {}),
    [projects, colors, labels, chartType],
  )

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={false}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
        disableOnboarding: true,
      }}
    >
      {/* Without right:1 the chart last point is not hoverable for some reason */}
      {chartType === 'bar' ? (
        <BarChart
          responsive
          data={data}
          margin={{ top: 20, right: 1 }}
          maxBarSize={12}
          barGap={1}
          barCategoryGap="25%"
        >
          <ChartLegendToggleAll
            showAllSelected={showAllSelected}
            onToggleAll={toggleAllDataKeys}
          />
          {projects.map((project) => (
            <Bar
              key={project.id}
              dataKey={project.id}
              hide={!dataKeys.includes(project.id)}
              fill={chartMeta[project.id]?.color}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={data}
            isLoading={false}
            chartType="bar"
            yAxis={{
              tickCount: 4,
              tickFormatter: (value) => formatYAxisLabel(Number(value)),
              ...yAxis,
            }}
            syncedUntil={undefined}
          />
          <ChartTooltip
            content={
              <CustomTooltip
                formatValue={formatTooltipValue}
                formatLabel={formatLabel}
              />
            }
          />
        </BarChart>
      ) : (
        <LineChart responsive data={data} margin={{ top: 20, right: 1 }}>
          <ChartLegendToggleAll
            showAllSelected={showAllSelected}
            onToggleAll={toggleAllDataKeys}
          />
          {projects.map((project) => (
            <Line
              key={project.id}
              dataKey={project.id}
              hide={!dataKeys.includes(project.id)}
              stroke={chartMeta[project.id]?.color}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={data}
            isLoading={false}
            yAxis={{
              tickCount: 4,
              tickFormatter: (value) => formatYAxisLabel(Number(value)),
              ...yAxis,
            }}
            syncedUntil={undefined}
          />
          <ChartTooltip
            content={
              <CustomTooltip
                formatValue={formatTooltipValue}
                formatLabel={formatLabel}
              />
            }
          />
        </LineChart>
      )}
    </ChartContainer>
  )
}

function CustomTooltip({
  payload,
  label,
  formatValue,
  formatLabel,
}: CustomChartTooltipProps & {
  formatValue: (
    value: number,
    point: LiquidStakingChartPoint,
    projectId: string,
  ) => string
  formatLabel: (timestamp: number) => string
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

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {formatLabel(label)}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {[...visible]
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((entry) => {
              const config = entry.name ? meta[entry.name] : undefined
              if (!config) return null
              return (
                <div
                  key={entry.name}
                  className="flex items-center justify-between gap-x-3"
                >
                  <div className="flex items-center gap-1">
                    <ChartDataIndicator
                      backgroundColor={config.color}
                      type={config.indicatorType}
                    />
                    <span className="font-medium text-label-value-14">
                      {config.label}
                    </span>
                  </div>
                  <span className="whitespace-nowrap font-medium text-label-value-15 text-primary tabular-nums">
                    {entry.value !== null &&
                    entry.value !== undefined &&
                    entry.name
                      ? formatValue(
                          entry.value,
                          entry.payload as LiquidStakingChartPoint,
                          String(entry.name),
                        )
                      : 'No data'}
                  </span>
                </div>
              )
            })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
