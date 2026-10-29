import type { Milestone } from '@l2beat/config'
import {
  assertUnreachable,
  formatActivityCount,
  formatInteger,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { formatRange } from '~/utils/dates'
import type { ChartScale } from '../types'

export type ActivityChartType = 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'

type SeriesKey = 'ethereum' | 'projects'

interface ActivityChartDataPoint {
  timestamp: number
  projects?: number | null
  ethereum: number | null
}

interface Props {
  data: ActivityChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  milestones: Milestone[]
  scale: ChartScale
  metric: ActivityMetric
  type: ActivityChartType
  project: ChartProject
  tickCount?: number
}

export function ActivityChart({
  data,
  syncedUntil,
  milestones,
  isLoading,
  scale,
  type,
  metric,
  project,
  tickCount,
}: Props) {
  const chartMeta = useMemo(
    () => ({
      ...(project.id !== ProjectId.ETHEREUM
        ? {
            projects: {
              label:
                project?.shortName ??
                project?.name ??
                (type === 'ValidiumsAndOptimiums'
                  ? 'Validiums & Optimiums'
                  : type),
              color: typeToColor(type),
              indicatorType: {
                shape: 'line',
              },
            },
          }
        : {}),
      ethereum: {
        label: 'Ethereum',
        color: 'var(--chart-ethereum)',
        indicatorType: {
          shape: 'line',
        },
      },
    }),
    [project.id, project.name, project.shortName, type],
  ) satisfies ChartMeta

  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)

  const projectsGradient = CHART_GRADIENTS[typeToGradient(type)]
  const series: ChartSeries<SeriesKey, ActivityChartDataPoint>[] = [
    {
      key: 'ethereum',
      stroke: CHART_GRADIENTS.ethereum.stroke,
      fill: CHART_GRADIENTS.ethereum.fill,
    },
    ...(project.id !== ProjectId.ETHEREUM
      ? [
          {
            key: 'projects' as const,
            stroke: projectsGradient.stroke,
            fill: projectsGradient.fill,
          },
        ]
      : []),
  ]

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      interactiveLegend={
        project.id === ProjectId.ETHEREUM
          ? undefined
          : {
              dataKeys,
              onItemClick: toggleDataKey,
            }
      }
      project={project}
      milestones={milestones}
      legend
    >
      <TimeSeriesChart
        data={data}
        series={series}
        ariaLabel="Activity"
        yAxis={{
          scale: scale === 'linear' ? undefined : scaleSymlog,
          domain: 'autoIfSingle',
          unit: metric === 'tps' ? ' TPS' : ' UOPS',
          tickCount: tickCount ?? 3,
        }}
        syncedUntil={syncedUntil}
        renderTooltip={(row, keys) => (
          <ActivityCustomTooltip row={row} keys={keys} metric={metric} />
        )}
      />
    </ChartContainer>
  )
}

export function ActivityCustomTooltip<
  T extends { timestamp: number },
  K extends string,
>({
  row,
  keys,
  metric,
  skipNull,
}: {
  row: T
  keys: K[]
  metric: ActivityMetric
  /** Leave out series without a value, instead of showing "No data". */
  skipNull?: boolean
}) {
  const timestamp = row.timestamp
  const payload = getTooltipEntries(row, keys, { skipNull })

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(timestamp, timestamp + UnixTime.DAY)}
        </div>
        <span className="text-heading-16">Average {metric.toUpperCase()}</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={entry.value}
                format={formatActivityCount}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>

        <span className="mt-3 text-heading-16">
          {metric === 'uops' ? 'Operations' : 'Transactions'} count
        </span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={entry.value}
                format={(value) => formatInteger(value * UnixTime.DAY)}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function typeToGradient(type: ActivityChartType) {
  switch (type) {
    case 'Rollups':
      return 'pink'
    case 'ValidiumsAndOptimiums':
      return 'cyan'
    case 'Others':
      return 'yellow'
    default:
      assertUnreachable(type)
  }
}

function typeToColor(type: ActivityChartType) {
  switch (type) {
    case 'Rollups':
      return 'var(--chart-pink)'
    case 'ValidiumsAndOptimiums':
      return 'var(--chart-cyan)'
    case 'Others':
      return 'var(--chart-yellow)'
    default:
      assertUnreachable(type)
  }
}
