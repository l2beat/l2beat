'use client'

import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import type { ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/ethereum-gradient-def'
import {
  OthersFillGradientDef,
  OthersStrokeGradientDef,
} from '~/components/core/chart/defs/others-gradient-def'
import {
  RollupsFillGradientDef,
  RollupsStrokeGradientDef,
} from '~/components/core/chart/defs/rollups-gradient-def'
import {
  ValidiumsAndOptimiumsFillGradientDef,
  ValidiumsAndOptimiumsStrokeGradientDef,
} from '~/components/core/chart/defs/validiums-and-optimiums-gradient-def'
import { DEFAULT_ACTIVE_DOT } from '~/components/core/chart/utils/active-dot'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
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
  milestones: Record<number, Milestone>
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
  const chartConfig = {
    projects: {
      label:
        projectName ??
        (type === 'ValidiumsAndOptimiums' ? 'Validiums and Optimiums' : type),
      color:
        type === 'ValidiumsAndOptimiums'
          ? 'hsl(var(--indicator-validiums-optimiums))'
          : `hsl(var(--indicator-${type.toLowerCase()}))`,
    },
    ethereum: {
      label: 'Ethereum',
      color: 'hsl(var(--indicator-ethereum))',
    },
  } satisfies ChartConfig

  const milestonesData = data?.map((point) => ({
    timestamp: point.timestamp,
    milestone: milestones[point.timestamp],
  }))

  return (
    <ChartContainer
      className={className}
      config={chartConfig}
      isLoading={isLoading}
      dataWithMilestones={milestonesData}
    >
      <AreaChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip syncedUntil={syncedUntil} />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="projects"
          stroke="url(#strokeProjects)"
          strokeWidth={2}
          fill="url(#fillProjects)"
          fillOpacity={1}
          dot={false}
          isAnimationActive={false}
          activeDot={{
            ...DEFAULT_ACTIVE_DOT,
            fill: 'var(--color-ethereum)',
          }}
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
            activeDot={{
              ...DEFAULT_ACTIVE_DOT,
              fill: 'var(--color-projects)',
            }}
          />
        )}
        {getCommonChartComponents({
          chartData: data,
          yAxis: {
            tick: {
              width: 100,
            },
            scale,
            unit: metric === 'tps' ? ' TPS' : ' UOPS',
          },
        })}
        <defs>
          {type === 'Rollups' && (
            <>
              <RollupsFillGradientDef id="fillProjects" />
              <RollupsStrokeGradientDef id="strokeProjects" />
            </>
          )}
          {type === 'ValidiumsAndOptimiums' && (
            <>
              <ValidiumsAndOptimiumsFillGradientDef id="fillProjects" />
              <ValidiumsAndOptimiumsStrokeGradientDef id="strokeProjects" />
            </>
          )}
          {type === 'Others' && (
            <>
              <OthersFillGradientDef id="fillProjects" />
              <OthersStrokeGradientDef id="strokeProjects" />
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
  const { config: chartConfig } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null
  return (
    <div className={tooltipContentVariants()}>
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
            const config = chartConfig[entry.name!]!
            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="relative inline-block size-3 rounded"
                    style={{
                      backgroundColor: config.color,
                    }}
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
            const config = chartConfig[entry.name!]!
            return (
              <div
                key={entry.name}
                className="flex w-full items-start justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="relative inline-block size-3 rounded"
                    style={{
                      backgroundColor: config.color,
                    }}
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
    </div>
  )
}
