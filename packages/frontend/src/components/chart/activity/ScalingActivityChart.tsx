import type { Milestone } from '@l2beat/config'
import { assertUnreachable, UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'

import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { Skeleton } from '~/components/core/Skeleton'
import { useTableFilterContext } from '~/components/table/filters/TableFilterContext'
import { useIsClient } from '~/hooks/useIsClient'
import { useLocalStorage } from '~/hooks/useLocalStorage'
import { EthereumLineIcon } from '~/icons/EthereumLineIcon'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { useActivityMetricContext } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { useActivityTimeRangeContext } from '~/pages/scaling/activity/components/ActivityTimeRangeContext'
import { ActivityTimeRangeControls } from '~/pages/scaling/activity/components/ActivityTimeRangeControls'
import type { ScalingActivityEntry } from '~/server/features/scaling/activity/getScalingActivityEntries'
import type { ActivityProjectFilter } from '~/server/features/scaling/activity/utils/projectFilterUtils'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import { Checkbox } from '../../core/Checkbox'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import type { ChartScale } from '../types'
import type { ActivityChartType } from './ActivityChart'
import { ActivityChart } from './ActivityChart'
import { ActivityChartHeader } from './ActivityChartHeader'
import { ActivityRatioChart } from './ActivityRatioChart'

interface Props {
  milestones: Milestone[]
  entries: ScalingActivityEntry[]
  hideScalingFactor?: boolean
  type: ActivityChartType
}

export function ScalingActivityChart({
  milestones,
  entries,
  hideScalingFactor,
  type,
}: Props) {
  const { timeRange, setTimeRange } = useActivityTimeRangeContext()
  const { metric } = useActivityMetricContext()
  const { state: filters } = useTableFilterContext()
  const [scale, setScale] = useLocalStorage<ChartScale>(
    'scaling-tvs-scale',
    'lin',
  )

  const [showMainnet, setShowMainnet] = useLocalStorage(
    'scaling-activity-show-mainnet',
    true,
  )

  const chartFilter: ActivityProjectFilter =
    Object.keys(filters).length === 0
      ? {
          type: typeToChartFilterType(type),
        }
      : {
          type: 'projects',
          projectIds: entries.map((project) => project.id),
        }

  const { data: stats } = api.activity.chartStats.useQuery({
    filter: chartFilter,
  })
  const { data, isLoading } = api.activity.chart.useQuery({
    range: { type: timeRange },
    filter: chartFilter,
  })

  const chartData = useMemo(
    () =>
      data?.data.map(
        ([timestamp, projectsTx, ethereumTx, projectsUops, ethereumUops]) => {
          const projectMetric = metric === 'tps' ? projectsTx : projectsUops
          const ethereumMetric = metric === 'tps' ? ethereumTx : ethereumUops
          return {
            timestamp,
            projects:
              projectMetric !== null ? projectMetric / UnixTime.DAY : null,
            ethereum:
              ethereumMetric !== null ? ethereumMetric / UnixTime.DAY : null,
          }
        },
      ),
    [data?.data, metric],
  )

  const ratioData = useMemo(() => {
    return data?.data.map(([timestamp, projectsTx, _, projectsUops]) => ({
      timestamp,
      ratio:
        projectsTx !== null && projectsUops !== null
          ? projectsTx === 0
            ? 1
            : projectsUops / projectsTx
          : null,
    }))
  }, [data?.data])

  const chartRange = getChartRange(chartData)

  return (
    <div className="flex flex-col">
      <ActivityChartHeader
        stats={stats}
        range={chartRange}
        hideScalingFactor={hideScalingFactor}
      />
      <ActivityChart
        className="mt-4 mb-2"
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        milestones={milestones}
        showMainnet={showMainnet}
        scale={scale}
        metric={metric}
        type={type}
      />
      <ActivityRatioChart
        data={ratioData}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        className="mb-2"
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
