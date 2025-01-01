'use client'

import { type Milestone, type ScalingProjectCategory } from '@l2beat/config'
import { useState } from 'react'
import { type ActivityMetric } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-context'
import { ActivityMetricControls } from '~/app/(side-nav)/scaling/activity/_components/activity-metric-controls'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { NotSyncedBanner } from '~/components/not-synced-banner'
import { featureFlags } from '~/consts/feature-flags'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Checkbox } from '../../core/checkbox'
import { Chart } from '../core/chart'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { ChartLegend } from '../core/chart-legend'
import { ChartProvider } from '../core/chart-provider'
import { ProjectChartTimeRange } from '../core/chart-time-range'
import { type ChartScale } from '../types'
import { ActivityChartHover } from './activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'
import { getChartType, typeToIndicator } from './utils/get-chart-type'

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
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('30d')
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

  const { columns, valuesStyle, chartRange, formatYAxisLabel } =
    useActivityChartRenderParams({
      milestones,
      chart,
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
      useLogScale={scale === 'log'}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <ActivityChartHover
          {...data}
          showEthereum={showMainnet}
          singleProject
          syncedUntil={chart?.syncStatus.syncedUntil}
          metric={metric}
          type={getChartType(category)}
          projectName={projectName}
        />
      )}
    >
      <section className="flex flex-col">
        <ChartControlsWrapper>
          <ProjectChartTimeRange range={chartRange} />
          <ActivityTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            projectSection
          />
        </ChartControlsWrapper>
        <Chart className="mt-4" />
        {featureFlags.showOthers && (
          <ChartLegend
            className="my-2"
            elements={[
              {
                name: projectName ?? 'Project',
                color: typeToIndicator(type),
              },
              {
                name: 'Ethereum',
                color: 'bg-indicator-ethereum',
              },
            ]}
          />
        )}
        <div className="flex justify-between gap-4">
          <div className="flex gap-1">
            <ActivityMetricControls
              value={metric}
              onValueChange={setMetric}
              projectChart
            />
            <Checkbox
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
            value={scale}
            onValueChange={(value) => setScale(value as ChartScale)}
          >
            <RadioGroupItem value="log">LOG</RadioGroupItem>
            <RadioGroupItem value="lin">LIN</RadioGroupItem>
          </RadioGroup>
        </div>
        {chart && !chart.syncStatus.isSynced && (
          <NotSyncedBanner what="Activity" data={chart} />
        )}
      </section>
    </ChartProvider>
  )
}
