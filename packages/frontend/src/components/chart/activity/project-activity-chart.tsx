'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Checkbox } from '../../core/checkbox'
import { Chart } from '../core/chart'
import { ChartProvider } from '../core/chart-provider'
import { ActivityChartHover } from './activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'

interface Props {
  milestones: Milestone[]
  projectId: string
}

export function ProjectActivityChart({ milestones, projectId }: Props) {
  const [timeRange, setTimeRange] = useState<ActivityTimeRange>('30d')
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
      data: data,
      showMainnet,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={timeRange}
      isLoading={isLoading}
      renderHoverContents={(data) => (
        <ActivityChartHover {...data} showEthereum={showMainnet} />
      )}
    >
      <section className="flex flex-col gap-4">
        <ActivityTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />
        <Chart />
        <div className="flex justify-between gap-4">
          <Checkbox
            id="show-mainnet"
            checked={showMainnet}
            onCheckedChange={(state) => setShowMainnet(!!state)}
          >
            <div className="flex flex-row items-center gap-2">
              <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
              <span className="max-lg:hidden">ETH Mainnet Transactions</span>
              <span className="lg:hidden">ETH Txs</span>
            </div>
          </Checkbox>
        </div>
      </section>
    </ChartProvider>
  )
}
