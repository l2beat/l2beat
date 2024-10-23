'use client'

import { type Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useState } from 'react'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Checkbox } from '../../core/checkbox'
import { Chart } from '../core/chart'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { ChartProvider } from '../core/chart-provider'
import { ProjectChartTimeRange } from '../core/chart-time-range'
import { type ChartScale } from '../types'
import { ActivityChartHover } from './activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'

interface Props {
  milestones: Milestone[]
  projectId: string
}

export function ProjectActivityChart({ milestones, projectId }: Props) {
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('30d')
  const [scale, setScale] = useState<ChartScale>('lin')
  const [showMainnet, setShowMainnet] = useState(true)

  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: {
      type: 'projects',
      projectIds: [projectId],
    },
  })

  const { columns, valuesStyle, chartRange, formatYAxisLabel } =
    useActivityChartRenderParams({
      milestones,
      data,
      showMainnet,
    })

  const projectSyncedUntil = data?.syncedStatuses[projectId]
  const isSynced = UnixTime.now()
    .add(-2, 'days')
    .lte(new UnixTime(projectSyncedUntil ?? 0))

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
          syncedUntil={projectSyncedUntil}
          singleProject
        />
      )}
    >
      <section className="flex flex-col gap-4">
        <ChartControlsWrapper>
          <ProjectChartTimeRange
            range={chartRange}
            syncStatus={{
              isSynced,
              syncedUntil: projectSyncedUntil,
            }}
          />
          <ActivityTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            projectSection
          />
        </ChartControlsWrapper>
        <Chart />
        <div className="flex justify-between gap-4">
          <Checkbox
            id="show-mainnet"
            checked={showMainnet}
            onCheckedChange={(state) => setShowMainnet(!!state)}
          >
            <div className="flex flex-row items-center gap-2">
              <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
              <span className="max-lg:hidden">ETH Mainnet Operations</span>
              <span className="lg:hidden">ETH UOPS</span>
            </div>
          </Checkbox>
          <RadioGroup
            value={scale}
            onValueChange={(value) => setScale(value as ChartScale)}
          >
            <RadioGroupItem value="log">LOG</RadioGroupItem>
            <RadioGroupItem value="lin">LIN</RadioGroupItem>
          </RadioGroup>
        </div>
      </section>
    </ChartProvider>
  )
}
