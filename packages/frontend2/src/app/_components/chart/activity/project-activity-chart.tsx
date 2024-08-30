'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
import { ActivityTimeRangeControls } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-controls'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { api } from '~/trpc/react'
import { Checkbox } from '../../checkbox'
import { RadioGroup, RadioGroupItem } from '../../radio-group'
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
  const [scale, setScale] = useState('lin')
  const [showMainnet, setShowMainnet] = useState(true)

  const { data, isLoading } = api.scaling.activity.chart.useQuery({
    range: timeRange,
    filter: {
      type: 'projects',
      projectIds: [projectId],
    },
  })

  const { columns, valuesStyle, chartRange, formatYAxisLabel } =
    useActivityChartRenderParams({
      milestones,
      chart: data?.data,
      showMainnet,
    })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={formatYAxisLabel}
      range={chartRange}
      useLogScale={scale === 'log'}
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
              <span className="hidden md:inline">ETH Mainnet Transactions</span>
              <span className="md:hidden">ETH Txs</span>
            </div>
          </Checkbox>
          <RadioGroup value={scale} onValueChange={setScale}>
            <RadioGroupItem value="log">LOG</RadioGroupItem>
            <RadioGroupItem value="lin">LIN</RadioGroupItem>
          </RadioGroup>
        </div>
      </section>
    </ChartProvider>
  )
}
