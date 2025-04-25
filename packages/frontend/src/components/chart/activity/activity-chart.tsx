'use client'

import type { Milestone } from '@l2beat/config'
import { assert, UnixTime, assertUnreachable } from '@l2beat/shared-pure'
import { compact } from 'lodash'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import type { ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/cyan-gradient-def'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/ethereum-gradient-def'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/pink-gradient-def'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/yellow-gradient-def'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { formatInteger } from '~/utils/number-format/format-integer'
import { getStrokeOverFillAreaComponents } from '../../core/chart/utils/get-stroke-over-fill-area-components'
import type { ChartScale } from '../types'

export type ActivityChartType = 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'

interface ActivityChartDataPoint {
  timestamp: number
  projects: number
  ethereum: number
}

interface Props {
  data: ActivityChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  milestones: Milestone[]
  showMainnet: boolean
  scale: ChartScale
  metric: ActivityMetric
  type: ActivityChartType
  projectName?: string
  className?: string
}

export function ActivityChart({
  data,
  syncedUntil,
  milestones,
  isLoading,
  showMainnet,
  scale,
  type,
  metric,
  projectName,
  className,
}: Props) {
  const chartMeta = {
    projects: {
      label:
        projectName ??
        (type === 'ValidiumsAndOptimiums' ? 'Validiums and Optimiums' : type),
      color: typeToColor(type),
      indicatorType: {
        shape: 'line',
      },
    },
    ethereum: {
      label: 'Ethereum',
      color: 'hsl(var(--chart-ethereum))',
      indicatorType: {
        shape: 'line',
      },
    },
  } satisfies ChartMeta

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
    >
      <AreaChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        {getStrokeOverFillAreaComponents({
          data: compact([
            showMainnet && {
              dataKey: 'ethereum',
              stroke: 'url(#strokeEthereum)',
              fill: 'url(#fillEthereum)',
            },
            {
              dataKey: 'projects',
              stroke: 'url(#strokeProjects)',
              fill: 'url(#fillProjects)',
            },
          ]),
        })}
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tick: {
              width: 100,
            },
            scale,
            unit: metric === 'tps' ? ' TPS' : ' UOPS',
          },
        })}
        <ChartTooltip
          content={<ActivityCustomTooltip syncedUntil={syncedUntil} />}
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
  syncedUntil,
}: TooltipProps<number, string> & { syncedUntil: number | undefined }) {
  const { meta } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null
  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="label-value-14-medium mb-3 whitespace-nowrap text-secondary">
          {formatTimestamp(timestamp, {
            longMonthName: true,
          })}
        </div>
        <span className="heading-16">Average UOPS</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (
              entry.name === undefined ||
              entry.value === undefined ||
              entry.type === 'none'
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
                  <span className="label-value-14-medium w-20 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="label-value-15-medium whitespace-nowrap tabular-nums">
                  {syncedUntil && syncedUntil < timestamp
                    ? 'Not synced'
                    : formatActivityCount(entry.value)}
                </span>
              </div>
            )
          })}
        </div>

        <span className="heading-16 mt-3">Operations count</span>
        <HorizontalSeparator className="mt-1.5" />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (
              entry.name === undefined ||
              entry.value === undefined ||
              entry.type === 'none'
            )
              return null
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex w-full items-start justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="label-value-14-medium w-20 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="label-value-15-medium whitespace-nowrap tabular-nums">
                  {syncedUntil && syncedUntil < timestamp
                    ? 'Not synced'
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
      return 'hsl(var(--chart-pink))'
    case 'ValidiumsAndOptimiums':
      return 'hsl(var(--chart-cyan))'
    case 'Others':
      return 'hsl(var(--chart-yellow))'
    default:
      assertUnreachable(type)
  }
}
