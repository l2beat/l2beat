import type { Milestone } from '@l2beat/config'
import {
  assert,
  assertUnreachable,
  formatActivityCount,
  formatInteger,
  ProjectId,
  UnixTime,
} from '@l2beat/shared-pure'
import { scaleSymlog } from 'd3-scale'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import {
  type ChartMeta,
  type ChartProject,
  useChart,
} from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/CyanGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/YellowGradientDef'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  ChartTooltipWrapper,
  getTooltipEntries,
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

  const series: ChartSeries<SeriesKey, ActivityChartDataPoint>[] = [
    {
      key: 'ethereum',
      stroke: 'url(#strokeEthereum)',
      fill: 'url(#fillEthereum)',
      hidden: !dataKeys.includes('ethereum'),
    },
    ...(project.id !== ProjectId.ETHEREUM
      ? [
          {
            key: 'projects' as const,
            stroke: 'url(#strokeProjects)',
            fill: 'url(#fillProjects)',
            hidden: !dataKeys.includes('projects'),
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
          domain: dataKeys.length === 1 ? 'auto' : undefined,
          unit: metric === 'tps' ? ' TPS' : ' UOPS',
          tickCount: tickCount ?? 3,
        }}
        syncedUntil={syncedUntil}
        defs={
          <>
            {type === 'Rollups' && (
              <>
                <PinkFillGradientDef id="fillProjects" />
                <PinkStrokeGradientDef id="strokeProjects" />
              </>
            )}
            {type === 'ValidiumsAndOptimiums' && (
              <>
                <CyanFillGradientDef id="fillProjects" />
                <CyanStrokeGradientDef id="strokeProjects" />
              </>
            )}
            {type === 'Others' && (
              <>
                <YellowFillGradientDef id="fillProjects" />
                <YellowStrokeGradientDef id="strokeProjects" />
              </>
            )}
            <EthereumFillGradientDef id="fillEthereum" />
            <EthereumStrokeGradientDef id="strokeEthereum" />
          </>
        }
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
  const { meta } = useChart()
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
          {payload.map((entry) => {
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value !== null && entry.value !== undefined
                    ? formatActivityCount(entry.value)
                    : 'No data'}
                </span>
              </div>
            )
          })}
        </div>

        <span className="mt-3 text-heading-16">
          {metric === 'uops' ? 'Operations' : 'Transactions'} count
        </span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value === null
                    ? 'No data'
                    : formatInteger(entry.value * UnixTime.DAY)}
                </span>
              </div>
            )
          })}
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
