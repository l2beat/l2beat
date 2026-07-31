import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
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
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { countPerSecond } from '~/server/features/scaling/activity/utils/countPerSecond'
import { useTRPC } from '~/trpc/React'
import { formatRange } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import type { CompareActivityUnit } from '../../utils/compareChartState'
import type { CompareMetricChartProps } from '../types'
import { getActivityCompareChartParams } from './getActivityCompareChartParams'

export function ActivityCompareChart({
  projects,
  state,
}: CompareMetricChartProps) {
  const trpc = useTRPC()
  const { data, isLoading } = useQuery(
    trpc.activity.detailedChartWithProjectsRanges.queryOptions(
      getActivityCompareChartParams(projects, state.chartRange),
    ),
  )
  const unit = state.activityUnit

  const chartMeta = useMemo<ChartMeta>(() => {
    const colors = generateAccessibleColors(projects.length)
    return projects.reduce<ChartMeta>((acc, project, index) => {
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
        color: colors[index] ?? 'var(--secondary)',
        indicatorType: { shape: 'line' },
      }
      return acc
    }, {})
  }, [projects])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => {
        const point: { timestamp: number; [key: string]: number | null } = {
          timestamp,
        }
        for (const project of projects) {
          const values = valuesByProject[project.id]
          point[project.id] = values
            ? countPerSecond(unit === 'tps' ? values[0] : values[1])
            : null
        }
        return point
      }),
    [data, projects, unit],
  )

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <div className="flex flex-col">
      <div className="mt-1 mb-2">
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
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={chartData}
            isLoading={isLoading}
            yAxis={{
              scale: state.scale === 'symlog' ? 'symlog' : 'auto',
              tickCount: 4,
              tickFormatter: (value) => formatActivityCount(Number(value)),
            }}
            syncedUntil={data?.syncedUntil}
          />
          <ChartTooltip content={<CustomTooltip unit={unit} />} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

function CustomTooltip({
  payload,
  label,
  unit,
}: CustomChartTooltipProps & { unit: CompareActivityUnit }) {
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
          {formatRange(label, label + UnixTime.DAY)}
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
                    {entry.value !== null && entry.value !== undefined
                      ? `${formatActivityCount(entry.value)} ${unit.toUpperCase()}`
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
