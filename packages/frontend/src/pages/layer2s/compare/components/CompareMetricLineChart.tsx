import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Line, LineChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
  chartSeriesStyle,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type { CompareProjectEntry } from '~/server/features/layer2s/compare/getCompareProjectEntries'
import { useIsCompareChartHovered } from './CompareChartHoverContext'
import { useCompareSeries } from './CompareSeriesContext'

/**
 * A single compare chart point: a timestamp plus one value per project id.
 * The shape every compare metric chart feeds into recharts.
 */
export interface CompareChartPoint {
  timestamp: number
  [projectId: string]: number | null
}

/**
 * Maps the rows of a `detailedChartWithProjectsRanges` response (a timestamp
 * followed by per-project values) to chart points, one value per selected
 * project. `getValue` returns `null` where the project has no data.
 */
export function toCompareChartPoints<
  Row extends [timestamp: number, ...unknown[]],
>(
  rows: Row[],
  projects: CompareProjectEntry[],
  getValue: (row: Row, projectId: string) => number | null,
): CompareChartPoint[] {
  return rows.map((row) => {
    const point: CompareChartPoint = { timestamp: row[0] }
    for (const project of projects) {
      point[project.id] = getValue(row, project.id)
    }
    return point
  })
}

interface Props {
  projects: CompareProjectEntry[]
  data: CompareChartPoint[] | undefined
  isLoading: boolean
  syncedUntil: number | undefined
  formatYAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
  renderTooltipTimestamp: (label: number) => ReactNode
}

/**
 * The shared compare chart renderer: lines, axes and tooltip for any
 * registry metric, so metrics only supply data and value formatting.
 */
export function CompareMetricLineChart({
  projects,
  data,
  isLoading,
  syncedUntil,
  formatYAxisLabel,
  formatTooltipValue,
  renderTooltipTimestamp,
}: Props) {
  const { colors, hoveredProjectId } = useCompareSeries()
  const chartMeta = useMemo<ChartMeta>(() => {
    return projects.reduce<ChartMeta>((acc, project) => {
      acc[project.id] = {
        label: (
          <span className="inline-flex items-center gap-1">
            <img
              src={project.iconUrl}
              alt=""
              width={14}
              height={14}
              className="size-3.5 rounded-full"
            />
            {project.name}
          </span>
        ),
        color: colors[project.id] ?? 'var(--secondary)',
        indicatorType: { shape: 'line' },
      }
      return acc
    }, {})
  }, [projects, colors])

  const timeRange = useMemo(() => getChartTimeRangeFromData(data), [data])

  return (
    <div className="flex flex-col">
      <div className="mt-3 mb-2">
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <ChartContainer
        data={data}
        meta={chartMeta}
        isLoading={isLoading}
        noDataSourceMessage="Please select at least one project"
      >
        {/* Without right:1 the chart last point is not hoverable for some reason */}
        {/* syncMethod "value" matches by timestamp, so charts whose data
            starts at different times still line up under a synced hover. */}
        <LineChart
          responsive
          data={data}
          margin={{ top: 20, right: 1 }}
          syncId="compare"
          syncMethod="value"
        >
          {projects.map((project) => (
            <Line
              {...chartSeriesStyle}
              key={project.id}
              dataKey={project.id}
              stroke={chartMeta[project.id]?.color}
              strokeOpacity={
                hoveredProjectId !== undefined &&
                hoveredProjectId !== project.id
                  ? 0.2
                  : 1
              }
              className="[&_.recharts-line-curve]:transition-[stroke-opacity] [&_.recharts-line-curve]:duration-200 motion-reduce:[&_.recharts-line-curve]:transition-none"
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={data}
            isLoading={isLoading}
            yAxis={{
              tickCount: 4,
              tickFormatter: (value) => formatYAxisLabel(Number(value)),
            }}
            syncedUntil={syncedUntil}
          />
          <ChartTooltip
            content={
              <CustomTooltip
                formatValue={formatTooltipValue}
                renderTimestamp={renderTooltipTimestamp}
              />
            }
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

const MAX_TOOLTIP_ROWS = 10

function CustomTooltip({
  payload,
  label,
  formatValue,
  renderTimestamp,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  renderTimestamp: (label: number) => ReactNode
}) {
  const { meta } = useChart()
  const isHovered = useIsCompareChartHovered()
  // On a synced hover the follower charts show only the crosshair cursor -
  // one full tooltip per hover is plenty, and with many projects selected
  // several tall tooltips at once would cover the very charts being compared.
  if (!isHovered) return null
  if (!payload || typeof label !== 'number') return null

  const visible = payload.filter(
    (entry) =>
      entry.type !== 'none' &&
      !entry.hide &&
      entry.value !== null &&
      entry.value !== undefined,
  )
  if (visible.length === 0) return null

  const sorted = [...visible].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
  const shown = sorted.slice(0, MAX_TOOLTIP_ROWS)
  const hiddenCount = sorted.length - shown.length

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {renderTimestamp(label)}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {shown.map((entry) => {
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
                  {entry.value !== null && entry.value !== undefined
                    ? formatValue(entry.value)
                    : 'No data'}
                </span>
              </div>
            )
          })}
          {hiddenCount > 0 && (
            <div className="font-medium text-label-value-14 text-secondary">
              +{hiddenCount} more
            </div>
          )}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
