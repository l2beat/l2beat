import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/scaling/activity/components/ActivityMetricControls'
import { ActivityTimeRangeControls } from '~/pages/scaling/activity/components/ActivityTimeRangeControls'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import type { ChartScale } from '../types'
import { ActivityChart } from './ActivityChart'
import { ActivityRatioChart } from './ActivityRatioChart'
import { getChartType } from './utils/getChartType'

interface Props {
  milestones: Milestone[]
  project: ChartProject
  category?: ProjectScalingCategory
  defaultRange: ActivityTimeRange
}

export function ProjectActivityChart({
  milestones,
  project,
  category,
  defaultRange,
}: Props) {
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>(defaultRange)
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('lin')

  const { data: chart, isLoading } = api.activity.chart.useQuery({
    range: { type: timeRange },
    filter: {
      type: 'projects',
      projectIds: [project.id],
    },
  })

  const type = getChartType(category)

  const chartData = useMemo(
    () =>
      chart?.data.map(
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
    [chart?.data, metric],
  )

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

  const chartRange = getChartRange(chartData)

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <ActivityTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          projectSection
        />
      </ChartControlsWrapper>
      <ActivityChart
        data={chartData}
        milestones={milestones}
        scale={scale}
        metric={metric}
        isLoading={isLoading}
        syncedUntil={chart?.syncedUntil}
        className="mt-4 mb-3"
        type={type}
        project={project}
        tickCount={4}
      />
      <ActivityRatioChart
        data={ratioData}
        syncedUntil={chart?.syncedUntil}
        isLoading={isLoading}
        className="mb-2"
      />

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
          <RadioGroupItem value="log">LOG</RadioGroupItem>
          <RadioGroupItem value="lin">LIN</RadioGroupItem>
        </RadioGroup>
      </div>
    </div>
  )
}
