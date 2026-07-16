import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { ActivityChartRangeControls } from '~/pages/scaling/activity/components/ActivityChartRangeControls'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/scaling/activity/components/ActivityMetricControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import type { ChartScale } from '../types'
import { ActivityChart } from './ActivityChart'
import { ActivityChartStatsPanel } from './ActivityChartStatsPanel'
import { ActivityRatioChart } from './ActivityRatioChart'
import { getChartType } from './utils/getChartType'

interface Props {
  milestones: Milestone[]
  project: ChartProject
  category?: ProjectScalingCategory
  defaultRange: ChartRange
}

export function EthereumActivityChart({
  milestones,
  project,
  category,
  defaultRange,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('linear')

  const { data: chart, isLoading } = useQuery(
    trpc.activity.ethereumChart.queryOptions({
      range,
    }),
  )

  const type = getChartType(category)

  const chartData = useMemo(
    () =>
      chart?.data.map(([timestamp, ethereumTx, ethereumUops]) => {
        const ethereumMetric = metric === 'tps' ? ethereumTx : ethereumUops
        return {
          timestamp,
          ethereum:
            ethereumMetric !== null ? ethereumMetric / UnixTime.DAY : null,
        }
      }),
    [chart?.data, metric],
  )

  const ratioData = useMemo(() => {
    return chart?.data.map(([timestamp, ethereumTx, ethereumUops]) => ({
      timestamp,
      ratio:
        ethereumTx !== null && ethereumUops !== null
          ? ethereumTx === 0
            ? 1
            : ethereumUops / ethereumTx
          : null,
    }))
  }, [chart?.data])

  const timeRange = getChartTimeRangeFromData(chartData, { bucket: 'day' })
  const lastRatio = ratioData?.at(-1)?.ratio
  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <ActivityChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <div className="mt-4 mb-3">
        <ActivityChart
          data={chartData}
          milestones={milestones}
          scale={scale}
          metric={metric}
          isLoading={isLoading}
          syncedUntil={chart?.syncedUntil}
          type={type}
          project={project}
          tickCount={4}
        />
      </div>
      <div className="mb-2">
        <ActivityRatioChart
          data={ratioData}
          syncedUntil={chart?.syncedUntil}
          isLoading={isLoading}
        />
      </div>

      <div className="flex justify-between gap-4">
        <ActivityMetricControls
          value={metric}
          onValueChange={setMetric}
          projectChart
        />
        <RadioGroup
          name="activityChartScale"
          value={scale}
          onValueChange={(value) => setScale(value as ChartScale)}
        >
          <RadioGroupItem value="symlog">LOG</RadioGroupItem>
          <RadioGroupItem value="linear">LIN</RadioGroupItem>
        </RadioGroup>
      </div>
      <ActivityChartStatsPanel
        stats={chart?.stats}
        metric={metric}
        lastRatio={lastRatio}
        isLoading={isLoading}
      />
    </div>
  )
}
