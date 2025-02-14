'use client'

import type { Milestone } from '@l2beat/config'
import { UnixTime, assertUnreachable } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
import { useScalingFilterValues } from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import type { ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { useActivityMetricContext } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { useActivityTimeRangeContext } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-context'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import { getCommonChartComponents } from '~/components/core/chart/common'
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
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import type { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/project-filter-utils'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/format-activity-count'
import { formatInteger } from '~/utils/number-format/format-integer'
import { Checkbox } from '../../core/checkbox'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { newGetChartRange } from '../core/utils/get-chart-range-from-columns'
import { mapMilestones } from '../core/utils/map-milestones'
import type { ChartScale } from '../types'
import { ActivityChartHeader } from './activity-chart-header'
import type { ActivityChartType } from './use-activity-chart-render-params'

interface Props {
  milestones: Milestone[]
  entries: ScalingActivityEntry[]
  hideScalingFactor?: boolean
  type: ActivityChartType
}

export function ActivityChart({
  milestones,
  entries,
  hideScalingFactor,
  type,
}: Props) {
  const { checked } = useRecategorisationPreviewContext()
  const { timeRange, setTimeRange } = useActivityTimeRangeContext()
  const { metric } = useActivityMetricContext()
  const filter = useScalingFilterValues()
  const [scale, setScale] = useLocalStorage<ChartScale>(
    'scaling-tvs-scale',
    'lin',
  )

  const [showMainnet, setShowMainnet] = useLocalStorage(
    'scaling-activity-show-mainnet',
    true,
  )

  const chartConfig = {
    projects: {
      label:
        type === 'ValidiumsAndOptimiums' ? 'Validiums and Optimiums' : type,
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

  const chartFilter: ActivityProjectFilter = filter.isEmpty
    ? {
        type: typeToChartFilterType(type),
      }
    : {
        type: 'projects',
        projectIds: entries.map((project) => project.id),
      }

  const { data: stats } = api.activity.chartStats.useQuery({
    filter: chartFilter,
    previewRecategorisation: checked,
  })
  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: chartFilter,
    previewRecategorisation: checked,
  })

  const mappedMilestones = useMemo(() => {
    return mapMilestones(milestones)
  }, [milestones])

  const chartData = useMemo(
    () =>
      data?.data.map(
        ([timestamp, projectsTx, ethereumTx, projectsUops, ethereumUops]) => {
          const projectMetric = metric === 'tps' ? projectsTx : projectsUops
          const ethereumMetric = metric === 'tps' ? ethereumTx : ethereumUops
          const milestone = mappedMilestones[timestamp]
          return {
            timestamp,
            projects: projectMetric / UnixTime.DAY,
            ethereum: ethereumMetric / UnixTime.DAY,
            milestone,
          }
        },
      ),
    [data?.data, mappedMilestones, metric],
  )
  const chartRange = newGetChartRange(chartData)

  return (
    <section className="flex flex-col">
      <ActivityChartHeader
        stats={stats}
        range={chartRange}
        hideScalingFactor={hideScalingFactor}
      />
      <ChartContainer
        className="mb-2 mt-4"
        config={chartConfig}
        isLoading={isLoading}
        dataWithMilestones={chartData}
      >
        <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
          <ChartTooltip
            content={<CustomTooltip syncedUntil={data?.syncedUntil} />}
          />
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
            chartData,
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
      <Controls
        scale={scale}
        setScale={setScale}
        showMainnet={showMainnet}
        setShowMainnet={setShowMainnet}
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        metric={metric}
      />
    </section>
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

interface ControlsProps {
  scale: ChartScale
  setScale: (scale: ChartScale) => void
  showMainnet: boolean
  setShowMainnet: (show: boolean) => void
  timeRange: ActivityTimeRange
  setTimeRange: (timeRange: ActivityTimeRange) => void
  metric: ActivityMetric
}

function Controls({
  scale,
  setScale,
  showMainnet,
  setShowMainnet,
  timeRange,
  setTimeRange,
  metric,
}: ControlsProps) {
  const isClient = useIsClient()
  return (
    <ChartControlsWrapper>
      <div className="flex gap-1">
        {isClient ? (
          <RadioGroup
            name="activityChartScale"
            value={scale}
            onValueChange={(value) => setScale(value as ChartScale)}
          >
            <RadioGroupItem value="log">LOG</RadioGroupItem>
            <RadioGroupItem value="lin">LIN</RadioGroupItem>
          </RadioGroup>
        ) : (
          <Skeleton className="h-8 w-[91px] md:w-[95px]" />
        )}
        {isClient ? (
          <Checkbox
            name="showMainnetActivity"
            checked={showMainnet}
            onCheckedChange={(state) => setShowMainnet(!!state)}
          >
            <div className="flex flex-row items-center gap-2">
              <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
              <span className="hidden md:inline">
                {`ETH Mainnet ${metric === 'uops' ? 'Operations' : 'Transactions'}`}
              </span>
              <span className="md:hidden">{`ETH ${metric === 'uops' ? 'UOPS' : 'TPS'}`}</span>
            </div>
          </Checkbox>
        ) : (
          <Skeleton className="h-8 w-[114px] md:w-[230px]" />
        )}
      </div>
      <ActivityTimeRangeControls
        timeRange={timeRange}
        setTimeRange={setTimeRange}
      />
    </ChartControlsWrapper>
  )
}

function typeToChartFilterType(
  type: ActivityChartType,
): Exclude<ActivityProjectFilter['type'], 'all' | 'projects'> {
  switch (type) {
    case 'Rollups':
      return 'rollups'
    case 'ValidiumsAndOptimiums':
      return 'validiumsAndOptimiums'
    case 'Others':
      return 'others'
    default:
      assertUnreachable(type)
  }
}
