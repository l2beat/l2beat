'use client'

import type { Milestone, ScalingProjectCategory } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import type { ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { ActivityMetricControls } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-controls'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { NotSyncedBanner } from '~/components/not-synced/not-synced-banner'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { ChartControlsWrapper } from '../../core/chart/chart-controls-wrapper'
import { ProjectChartTimeRange } from '../../core/chart/chart-time-range'
import { getChartRange } from '../../core/chart/utils/get-chart-range-from-columns'
import { Checkbox } from '../../core/checkbox'
import type { ChartScale } from '../types'
import { ActivityChart } from './activity-chart'
import { getChartType } from './utils/get-chart-type'

interface Props {
  milestones: Milestone[]
  projectId: string
  category?: ScalingProjectCategory
  projectName?: string
}

export function ProjectActivityChart({
  milestones,
  projectId,
  category,
  projectName,
}: Props) {
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('1y')
  const [metric, setMetric] = useState<ActivityMetric>('uops')
  const [scale, setScale] = useState<ChartScale>('lin')
  const [showMainnet, setShowMainnet] = useState(true)

  const { data: chart, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
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
            projects: projectMetric / UnixTime.DAY,
            ethereum: ethereumMetric / UnixTime.DAY,
          }
        },
      ),
    [chart?.data, metric],
  )

  const chartRange = getChartRange(chartData)

  return (
    <section className="flex flex-col">
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
        className="mb-2 mt-4"
        type={type}
        projectName={projectName}
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
      {chart?.syncWarning && <NotSyncedBanner content={chart.syncWarning} />}
    </section>
  )
}
