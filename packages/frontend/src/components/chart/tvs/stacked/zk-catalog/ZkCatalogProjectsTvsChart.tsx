import type { Milestone } from '@l2beat/config'
import type { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Area, AreaChart } from 'recharts'
import { useTvsChartControlsContext } from '~/components/chart/tvs/TvsChartControlsContext'
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
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { VerticalSeparator } from '~/components/core/VerticalSeparator'
import { useScalingRwaRestrictedTokensContext } from '~/pages/scaling/components/ScalingRwaRestrictedTokensContext'
import { api } from '~/trpc/React'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { formatTimestamp } from '~/utils/dates'
import { generateAccessibleColors } from '~/utils/generateColors'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import type { ChartUnit } from '../../../types'

interface ZkCatalogProjectsTvsChartProps {
  project: ChartProject
  milestones: Milestone[]
  projectsForTvs: {
    projectId: ProjectId
    name: string
    sinceTimestamp: UnixTime
    untilTimestamp?: UnixTime
  }[]
}

export function ZkCatalogProjectsTvsChart({
  project,
  milestones,
  projectsForTvs,
}: ZkCatalogProjectsTvsChartProps) {
  const { range, unit } = useTvsChartControlsContext()
  const { excludeRwaRestrictedTokens } = useScalingRwaRestrictedTokensContext()

  const { data, isLoading } = api.tvs.detailedChartWithProjectsRanges.useQuery({
    projects: projectsForTvs,
    range,
    excludeAssociatedTokens: false,
    excludeRwaRestrictedTokens,
  })

  const projectLabels = useMemo(() => {
    return projectsForTvs.reduce(
      (acc, project) => {
        acc[project.projectId] = project.name
        return acc
      },
      {} as Record<string, string>,
    )
  }, [projectsForTvs])

  const colors = useMemo(
    () => generateAccessibleColors(data?.projectIds.length ?? 0),
    [data?.projectIds.length],
  )

  const chartMeta = useMemo(() => {
    let colorIndex = 0
    return (data?.projectIds ?? []).reduce((acc, projectId) => {
      const key = projectId.toString()
      const color = colors[colorIndex++] ?? '#999999'

      acc[key] = {
        label: projectLabels[key] ?? key,
        color,
        indicatorType: { shape: 'square' },
      }
      return acc
    }, {} as ChartMeta)
  }, [colors, projectLabels, data?.projectIds])

  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(chartMeta)

  const chartData = useMemo(() => {
    if (!data) return undefined

    return data.chart.map(([timestamp, ethPrice, projects]) => {
      const divider = unit === 'usd' ? 1 : ethPrice
      const dataPoint: {
        timestamp: number
        [key: string]: number | null
      } = { timestamp }

      for (const projectId of data.projectIds) {
        const value = projects[projectId] ?? null
        if (value === null) {
          dataPoint[projectId] = null
          continue
        }
        if (divider === null || divider === 0) {
          dataPoint[projectId] = null
          continue
        }
        dataPoint[projectId] = value[0] / divider
      }

      return dataPoint
    })
  }, [data, unit])

  return (
    <ChartContainer
      data={chartData}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      className="mt-4 mb-3"
      project={project}
    >
      <AreaChart data={chartData} margin={{ top: 20 }}>
        <ChartLegend
          content={
            <ChartLegendContent>
              <div className="flex shrink-0 items-center">
                <button
                  className="w-11 cursor-pointer select-none text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px] transition-opacity hover:opacity-50 [&>svg]:text-secondary"
                  onClick={toggleAllDataKeys}
                >
                  {showAllSelected ? 'Hide' : 'Show'} all
                </button>
                <VerticalSeparator className="mx-2 h-3" />
              </div>
            </ChartLegendContent>
          }
        />
        {(data?.projectIds ?? []).map((projectId) => (
          <Area
            key={projectId}
            dataKey={projectId}
            hide={!dataKeys.includes(projectId)}
            fill={chartMeta[projectId]?.color}
            fillOpacity={1}
            strokeWidth={0}
            stackId={dataKeys.length === 1 ? undefined : 'a'}
            isAnimationActive={false}
          />
        ))}
        <ChartCommonComponents
          data={chartData}
          isLoading={isLoading}
          yAxis={{
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            tickFormatter: (value: number) => formatCurrency(value, unit),
            tickCount: 4,
          }}
          syncedUntil={data?.syncedUntil}
        />
        <ChartTooltip
          content={<CustomTooltip unit={unit} />}
          filterNull={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  payload,
  label,
  unit,
}: CustomChartTooltipProps & { unit: ChartUnit }) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  const actualPayload = [...payload]
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))
    .filter((entry) => !entry.hide)

  const total = actualPayload.reduce((acc, entry) => {
    return acc + (entry.value ?? 0)
  }, 0)

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
      </div>
      <div className="mt-3 flex w-full items-center justify-between gap-2 text-heading-16">
        <span>Total</span>
        <span className="whitespace-nowrap text-primary tabular-nums">
          {total !== null ? formatCurrency(total, unit) : 'No data'}
        </span>
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {actualPayload.slice(0, 20).map((entry, index) => {
          if (entry.type === 'none' || !entry.name) return null
          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-1"
            >
              <span className="flex items-center gap-1">
                <ChartDataIndicator
                  backgroundColor={config.color}
                  type={config.indicatorType}
                />
                <span className="font-medium text-label-value-14">
                  {config.label}
                </span>
              </span>
              <div className="flex items-end justify-end gap-1 max-sm:flex-col sm:items-center">
                <span className="whitespace-nowrap font-medium text-label-value-15">
                  {entry.value !== null && entry.value !== undefined
                    ? formatCurrency(entry.value, unit)
                    : 'No data'}
                </span>
                {entry.value !== null &&
                  entry.value !== undefined &&
                  total > 0 && (
                    <span className="font-medium text-label-value-13 text-secondary sm:text-label-value-15">
                      ({formatPercent(entry.value / total)})
                    </span>
                  )}
              </div>
            </div>
          )
        })}
        {actualPayload.length > 20 && (
          <div className="font-medium text-label-value-14 text-secondary">
            + {actualPayload.length - 20} more
          </div>
        )}
      </div>
    </ChartTooltipWrapper>
  )
}
