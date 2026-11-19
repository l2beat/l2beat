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
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import { TooltipHeader } from '~/components/core/tooltip/TooltipParts'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import type { ChartScale } from '../types'
import { formatActivityPeriod } from './utils/activityPeriod'

export type ActivityChartType = 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'

type SeriesKey = 'ethereum' | 'projects'

interface ActivityChartDataPoint {
  timestamp: number
  /** Where a period still under way ends so far */
  periodEnd?: number
  projects?: number | null
  ethereum: number | null
}

interface Props {
  data: ActivityChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  milestones: Milestone[]
  scale: ChartScale
  metric: ActivityMetric
  type: ActivityChartType
  project: ChartProject
  tickCount?: number
  resolution?: ActivityResolution
}

export function ActivityChart({
  data,
  syncedUntil,
  milestones,
  isLoading,
  isPlaceholderData,
  scale,
  type,
  metric,
  project,
  tickCount,
  resolution = 'day',
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

  const series: ChartSeries<SeriesKey, ActivityChartDataPoint>[] = [
    {
      key: 'ethereum',
      ...tinted(chartMeta.ethereum.color),
    },
    ...(project.id !== ProjectId.ETHEREUM
      ? [
          {
            key: 'projects' as const,
            ...tinted(typeToColor(type)),
          },
        ]
      : []),
  ]

  return (
    <ChartContainer
      isPlaceholderData={isPlaceholderData}
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
          format: (value) => formatActivityCount(value),
          tickCount: tickCount ?? 3,
        }}
        syncedUntil={syncedUntil}
        renderTooltip={(row, keys) => (
          <ActivityCustomTooltip
            row={row}
            keys={keys}
            metric={metric}
            resolution={resolution}
          />
        )}
      />
    </ChartContainer>
  )
}

export function ActivityCustomTooltip<
  T extends { timestamp: number; periodEnd?: number },
  K extends string,
>({
  row,
  keys,
  metric,
  skipNull,
  resolution = 'day',
}: {
  row: T
  keys: K[]
  metric: ActivityMetric
  /** Leave out series without a value, instead of showing "No data". */
  skipNull?: boolean
  resolution?: ActivityResolution
}) {
  const timestamp = row.timestamp
  const end = row.periodEnd ?? timestamp + UnixTime.periodToSeconds(resolution)
  const payload = getTooltipEntries(row, keys, { skipNull })

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <ChartTooltipTitle className="mb-3 whitespace-nowrap">
          {formatActivityPeriod(timestamp, resolution, end)}
        </ChartTooltipTitle>
        <TooltipHeader label={`Average ${metric.toUpperCase()}`} />
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

        <TooltipHeader
          className="mt-3"
          label={`${metric === 'uops' ? 'Operations' : 'Transactions'} count`}
        />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => (
            <ChartTooltipRow key={entry.name} name={entry.name}>
              <ChartTooltipValue
                value={entry.value}
                format={(value) => formatInteger(value * (end - timestamp))}
                className="tabular-nums"
              />
            </ChartTooltipRow>
          ))}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
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
