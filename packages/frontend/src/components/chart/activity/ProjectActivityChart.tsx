import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { ActivityChartRangeControls } from '~/pages/layer2s/activity/components/ActivityChartRangeControls'
import type { ActivityMetric } from '~/pages/layer2s/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/layer2s/activity/components/ActivityMetricControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import type { ChartScale } from '../types'
import { ActivityChart } from './ActivityChart'
import { ActivityChartStatsPanel } from './ActivityChartStatsPanel'
import { ActivityRatioChart } from './ActivityRatioChart'
import { getActivityPeriodSeconds } from './utils/getActivityPeriodSeconds'
import { getChartType } from './utils/getChartType'

interface Props {
  milestones: Milestone[]
  project: ChartProject
  category?: ProjectScalingCategory
  defaultRange: ChartRange
}

export function ProjectActivityChart({
  milestones,
  project,
  category,
  defaultRange,
}: Props) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('linear')

  const {
    data: chart,
    isLoading,
    isPlaceholderData,
  } = useChartQuery(trpc.activity.chart, {
    range,
    filter: {
      type: 'projects',
      projectIds: [project.id],
    },
    hourly: true,
  })

  const type = getChartType(category)
  const resolution = chart?.resolution ?? 'day'

  const liveUntil = chart?.liveUntil
  const chartData = useMemo(() => {
    return chart?.data.map(
      ([timestamp, projectsTx, ethereumTx, projectsUops, ethereumUops]) => {
        const seconds = getActivityPeriodSeconds(
          timestamp,
          resolution,
          liveUntil,
        )
        const projectMetric = metric === 'tps' ? projectsTx : projectsUops
        const ethereumMetric = metric === 'tps' ? ethereumTx : ethereumUops
        return {
          timestamp,
          projects: projectMetric !== null ? projectMetric / seconds : null,
          ethereum: ethereumMetric !== null ? ethereumMetric / seconds : null,
        }
      },
    )
  }, [chart?.data, metric, resolution, liveUntil])

  const ratioData = useMemo(() => {
    return chart?.data.map(([timestamp, projectsTx, _, projectsUops]) => ({
      timestamp,
      ratio:
        projectsTx !== null && projectsUops !== null
          ? projectsTx === 0
            ? 1
            : projectsUops / projectsTx
          : null,
    }))
  }, [chart?.data])

  const timeRange = getChartTimeRangeFromData(chartData, { bucket: resolution })
  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <ActivityChartRangeControls
          range={range}
          setRange={setRange}
          hourlyRanges={chart?.hasHourly === false ? 'disabled' : 'enabled'}
        />
      </ChartControlsWrapper>
      <div className="mt-4 mb-3">
        <ActivityChart
          isPlaceholderData={isPlaceholderData}
          data={chartData}
          milestones={milestones}
          scale={scale}
          metric={metric}
          isLoading={isLoading}
          syncedUntil={liveUntil ?? chart?.syncedUntil}
          type={type}
          project={project}
          tickCount={4}
          resolution={resolution}
          liveUntil={liveUntil}
        />
      </div>
      <div className="mb-2">
        <ActivityRatioChart
          isPlaceholderData={isPlaceholderData}
          data={ratioData}
          syncedUntil={liveUntil ?? chart?.syncedUntil}
          isLoading={isLoading}
          resolution={resolution}
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
        isLoading={isLoading}
      />
    </div>
  )
}
