'use client'

import type { Milestone } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import {
  type ActivityMetric,
  useActivityMetricContext,
} from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { useActivityTimeRangeContext } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-context'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { Skeleton } from '~/components/core/skeleton'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { useIsClient } from '~/hooks/use-is-client'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ScalingActivityEntry } from '~/server/features/scaling/activity/get-scaling-activity-entries'
import { type ActivityProjectFilter } from '~/server/features/scaling/activity/utils/project-filter-utils'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Checkbox } from '../../core/checkbox'
import { Chart } from '../core/chart'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { ChartLegend } from '../core/chart-legend'
import { ChartProvider } from '../core/chart-provider'
import { type ChartScale } from '../types'
import { ActivityChartHeader } from './activity-chart-header'
import { ActivityChartHover } from './activity-chart-hover'
import {
  type ActivityChartType,
  useActivityChartRenderParams,
} from './use-activity-chart-render-params'
import { typeToIndicator } from './utils/get-chart-type'

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
  const includeFilter = useScalingFilter()
  const filter = useScalingFilterValues()
  const [scale, setScale] = useLocalStorage<ChartScale>(
    'scaling-tvl-scale',
    'lin',
  )

  const [showMainnet, setShowMainnet] = useLocalStorage(
    'scaling-activity-show-mainnet',
    true,
  )

  const chartFilter: ActivityProjectFilter = filter.isEmpty
    ? {
        type: typeToChartFilterType(type),
      }
    : {
        type: 'projects',
        projectIds: entries.filter(includeFilter).map((project) => project.id),
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

  const { columns, valuesStyle, chartRange, formatYAxisLabel } =
    useActivityChartRenderParams({
      milestones,
      chart: data,
      showMainnet,
      metric,
      type,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <ActivityChartHover
          {...data}
          showEthereum={showMainnet}
          metric={metric}
          singleProject={
            chartFilter.type === 'projects' &&
            chartFilter.projectIds?.length === 1
          }
          type={type}
        />
      )}
      useLogScale={scale === 'log'}
    >
      <section className="flex flex-col">
        <ActivityChartHeader
          stats={stats}
          range={chartRange}
          hideScalingFactor={hideScalingFactor}
        />
        <Chart className="mt-4" />
        <ChartLegend
          className="my-2"
          elements={[
            {
              name:
                type === 'ValidiumsAndOptimiums'
                  ? 'Validiums and Optimiums'
                  : (type ?? 'Projects'),
              color: typeToIndicator(type),
            },
            {
              name: 'Ethereum',
              color: 'bg-indicator-ethereum',
            },
          ]}
        />
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
    </ChartProvider>
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
