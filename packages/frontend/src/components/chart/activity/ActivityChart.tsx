import type { Milestone } from '@l2beat/config'
import { assert, assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
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
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { formatRange } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { getStrokeOverFillAreaComponents } from '../../core/chart/utils/getStrokeOverFillAreaComponents'
import type { ChartScale } from '../types'

export type ActivityChartType = 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'

interface ActivityChartDataPoint {
  timestamp: number
  projects: number | null
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
  project?: ChartProject
  className?: string
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
  className,
  tickCount,
}: Props) {
  const chartMeta = useMemo(
    () => ({
      projects: {
        label:
          project?.shortName ??
          project?.name ??
          (type === 'ValidiumsAndOptimiums' ? 'Validiums & Optimiums' : type),
        color: typeToColor(type),
        indicatorType: {
          shape: 'line',
        },
      },
      ethereum: {
        label: 'Ethereum',
        color: 'var(--chart-ethereum)',
        indicatorType: {
          shape: 'line',
        },
      },
    }),
    [project?.name, project?.shortName, type],
  ) satisfies ChartMeta

  const { dataKeys, toggleDataKey } = useChartDataKeys(chartMeta)

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
      interactiveLegend={{
        dataKeys,
        onItemClick: toggleDataKey,
      }}
      project={project}
      milestones={milestones}
    >
      <AreaChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        {getStrokeOverFillAreaComponents({
          data: [
            {
              dataKey: 'ethereum',
              stroke: 'url(#strokeEthereum)',
              fill: 'url(#fillEthereum)',
              hide: !dataKeys.includes('ethereum'),
            },
            {
              dataKey: 'projects',
              stroke: 'url(#strokeProjects)',
              fill: 'url(#fillProjects)',
              hide: !dataKeys.includes('projects'),
            },
          ],
        })}
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            scale,
            domain: dataKeys.length === 1 ? ['auto', 'auto'] : undefined,
            unit: metric === 'tps' ? ' TPS' : ' UOPS',
            tickCount,
          },
          syncedUntil,
        })}
        <ChartTooltip
          filterNull={false}
          content={<ActivityCustomTooltip metric={metric} />}
        />
        <defs>
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
        </defs>
      </AreaChart>
    </ChartContainer>
  )
}

export function ActivityCustomTooltip({
  active,
  payload,
  label: timestamp,
  metric,
}: TooltipProps<number, string> & {
  metric: ActivityMetric
}) {
  const { meta } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null

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
            if (entry.name === undefined || entry.type === 'none' || entry.hide)
              return null
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
            if (
              entry.name === undefined ||
              entry.value === undefined ||
              entry.type === 'none' ||
              entry.hide
            )
              return null
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
