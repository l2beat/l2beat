'use client'

import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
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
      color:
        type === 'ValidiumsAndOptimiums'
          ? 'hsl(var(--chart-cyan))'
          : `hsl(var(--chart-${type.toLowerCase()}))`,
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
        <Area
          dataKey="projects"
          stroke="url(#strokeProjects)"
          strokeWidth={2}
          fill="url(#fillProjects)"
          fillOpacity={1}
          dot={false}
          isAnimationActive={false}
        />
        {showMainnet && (
          <Area
            dataKey="ethereum"
            stroke="url(#strokeEthereum)"
            strokeWidth={2}
            fill="url(#fillEthereum)"
            fillOpacity={1}
            dot={false}
            isAnimationActive={false}
          />
        )}
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
        <ChartTooltip content={<CustomTooltip syncedUntil={syncedUntil} />} />
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

function CustomTooltip({
  active,
  payload,
  label: timestamp,
  syncedUntil,
}: TooltipProps<number, string> & { syncedUntil: number | undefined }) {
  const { meta } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null
  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col gap-1 sm:w-60">
        <div className="mb-1 whitespace-nowrap">
          {formatTimestamp(timestamp, {
            longMonthName: true,
          })}
        </div>
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-secondary">Average UOPS</span>
          </div>
        </div>
        <HorizontalSeparator className="mb-1" />
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = meta[entry.name!]!
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
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-bold tabular-nums">
                  {syncedUntil && syncedUntil < timestamp
                    ? 'Not synced'
                    : formatActivityCount(entry.value)}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-2 flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <span className="text-sm text-secondary">Operations count</span>
          </div>
        </div>
        <HorizontalSeparator className="mb-1" />
        <div>
          {payload.map((entry) => {
            if (entry.value === undefined) return null
            const config = meta[entry.name!]!
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
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-bold tabular-nums">
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
