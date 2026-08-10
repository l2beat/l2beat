import { formatNumber } from '@l2beat/shared-pure'
import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Line, LineChart } from 'recharts'
import type { ChartScale } from '~/components/chart/types'
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
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import type { CompareProjectEntry } from '~/server/features/scaling/compare/getCompareProjectEntries'
import type { CompareViewMode } from '../utils/compareChartState'
import {
  type CompareChartPoint,
  toIndexedChartData,
} from '../utils/toIndexedChartData'
import { useCompareSeries } from './CompareSeriesContext'

interface Props {
  projects: CompareProjectEntry[]
  data: CompareChartPoint[] | undefined
  isLoading: boolean
  syncedUntil: number | undefined
  scale: ChartScale
  mode: CompareViewMode
  /** Absolute-mode formatters; indexed mode shows unitless index values. */
  formatYAxisLabel: (value: number) => string
  formatTooltipValue: (value: number) => string
  renderTooltipTimestamp: (label: number) => ReactNode
}

/**
 * The shared compare chart renderer: legend, lines, axes and tooltip for any
 * registry metric. Also the single place implementing the indexed view mode -
 * every series is rebased to 100 client-side, so metrics only supply data and
 * absolute-value formatting.
 */
export function CompareMetricLineChart({
  projects,
  data,
  isLoading,
  syncedUntil,
  scale,
  mode,
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
        legendLabel: project.shortName ?? project.name,
        color: colors[project.id] ?? 'var(--secondary)',
        indicatorType: { shape: 'line' },
      }
      return acc
    }, {})
  }, [projects, colors])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const indexed = mode === 'indexed'
  const { chartData, rebasedMidRange } = useMemo(() => {
    if (!data || !indexed) {
      return { chartData: data, rebasedMidRange: {} }
    }
    const result = toIndexedChartData(
      data,
      projects.map((project) => project.id),
    )
    return { chartData: result.data, rebasedMidRange: result.rebasedMidRange }
  }, [data, indexed, projects])

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <div className="flex flex-col">
      <div className="mt-3 mb-2">
        <ChartTimeRange timeRange={timeRange} />
      </div>
      <ChartContainer
        data={chartData}
        meta={chartMeta}
        isLoading={isLoading}
        interactiveLegend={{
          dataKeys,
          onItemClick: toggleDataKey,
        }}
      >
        {/* Without right:1 the chart last point is not hoverable for some reason */}
        <LineChart responsive data={chartData} margin={{ top: 20, right: 1 }}>
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
              strokeOpacity={
                hoveredProjectId !== undefined &&
                hoveredProjectId !== project.id
                  ? 0.2
                  : 1
              }
              className="[&_.recharts-line-curve]:transition-[stroke-opacity] [&_.recharts-line-curve]:duration-200 motion-reduce:[&_.recharts-line-curve]:transition-none"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={{
              scale: !indexed && scale === 'symlog' ? 'symlog' : 'auto',
              tickCount: 4,
              tickFormatter: (value) =>
                indexed
                  ? formatIndexValue(Number(value))
                  : formatYAxisLabel(Number(value)),
            }}
            syncedUntil={syncedUntil}
          />
          <ChartTooltip
            content={
              <CustomTooltip
                formatValue={indexed ? formatIndexValue : formatTooltipValue}
                renderTimestamp={renderTooltipTimestamp}
                rebasedMidRange={rebasedMidRange}
              />
            }
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

function formatIndexValue(value: number) {
  return formatNumber(value, value < 10 ? 1 : 0)
}

function CustomTooltip({
  payload,
  label,
  formatValue,
  renderTimestamp,
  rebasedMidRange,
}: CustomChartTooltipProps & {
  formatValue: (value: number) => string
  renderTimestamp: (label: number) => ReactNode
  rebasedMidRange: Record<string, number>
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

  const hasRebasedNote = visible.some(
    (entry) => entry.name && rebasedMidRange[entry.name] !== undefined,
  )

  return (
    <ChartTooltipWrapper>
      <div className="flex w-[200px] flex-col [@media(min-width:600px)]:w-60">
        <div className="font-medium text-label-value-14 text-secondary">
          {renderTimestamp(label)}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {[...visible]
            .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
            .map((entry) => {
              const config = entry.name ? meta[entry.name] : undefined
              if (!config) return null
              const isRebased =
                entry.name !== undefined &&
                rebasedMidRange[entry.name] !== undefined
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
                      ? `${formatValue(entry.value)}${isRebased ? '*' : ''}`
                      : 'No data'}
                  </span>
                </div>
              )
            })}
        </div>
        {hasRebasedNote && (
          <div className="mt-2 font-medium text-2xs text-secondary">
            * Data starts mid-range; indexed to 100 at the first available data
            point.
          </div>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}
