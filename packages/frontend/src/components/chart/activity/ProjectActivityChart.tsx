import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { EthereumLineIcon } from '~/icons/EthereumLineIcon'
import type { ActivityMetric } from '~/pages/scaling/activity/components/ActivityMetricContext'
import { ActivityMetricControls } from '~/pages/scaling/activity/components/ActivityMetricControls'
import { ActivityTimeRangeControls } from '~/pages/scaling/activity/components/ActivityTimeRangeControls'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/React'
import { Checkbox } from '../../core/Checkbox'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import type { ChartScale } from '../types'
import { ActivityChart } from './ActivityChart'
import { ActivityRatioChart } from './ActivityRatioChart'
import { getChartType } from './utils/getChartType'

interface Props {
  milestones: Milestone[]
  projectId: string
  category?: ProjectScalingCategory
  projectName?: string
  defaultRange: ActivityTimeRange
}

export function ProjectActivityChart({
  milestones,
  projectId,
  category,
  projectName,
  defaultRange,
}: Props) {
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>(defaultRange)
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('lin')
  const [showMainnet, setShowMainnet] = useState(true)

  const { data: chart, isLoading } = api.activity.chart.useQuery({
    range: { type: timeRange },
    filter: {
      type: 'projects',
      projectIds: [projectId],
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
        showMainnet={showMainnet}
        scale={scale}
        metric={metric}
        isLoading={isLoading}
        syncedUntil={chart?.syncedUntil}
        className="mt-4 mb-2"
        type={type}
        projectName={projectName}
        tickCount={4}
      />
      <ActivityRatioChart
        data={ratioData}
        syncedUntil={chart?.syncedUntil}
        isLoading={isLoading}
        className="mb-2"
      />

      <div className="flex justify-between gap-4">
        <div className="flex gap-1">
          <ActivityMetricControls
            value={metric}
            onValueChange={setMetric}
            projectChart
          />
          <Checkbox
            name="showMainnetActivity"
            checked={showMainnet}
            onCheckedChange={(state) => setShowMainnet(!!state)}
          >
            <div className="flex flex-row items-center gap-2">
              <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
              <span className="max-lg:hidden">{`ETH Mainnet ${metric === 'uops' ? 'Operations' : 'Transactions'}`}</span>
              <span className="lg:hidden">{`ETH ${metric === 'uops' ? 'UOPS' : 'TPS'}`}</span>
            </div>
          </Checkbox>
        </div>
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
