'use client'

import { type Milestone } from '@l2beat/config'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(side-nav)/scaling/_components/scaling-filter-context'
import { useActivityTimeRangeContext } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-context'
import { ActivityTimeRangeControls } from '~/app/(side-nav)/scaling/activity/_components/activity-time-range-controls'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { api } from '~/trpc/react'
import { Checkbox } from '../../core/checkbox'
import { Chart } from '../core/chart'
import { ChartControlsWrapper } from '../core/chart-controls-wrapper'
import { ChartProvider } from '../core/chart-provider'
import { type ChartScale } from '../types'
import { ActivityChartHeader } from './activity-chart-header'
import { ActivityChartHover } from './activity-chart-hover'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'

interface Props {
  milestones: Milestone[]
  entries: ScalingActivityEntry[]
}

export function ActivityChart({ milestones, entries }: Props) {
  const { timeRange, setTimeRange } = useActivityTimeRangeContext()
  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [scale, setScale] = useLocalStorage<ChartScale>(
    'scaling-tvl-scale',
    'lin',
  )

  const [showMainnet, setShowMainnet] = useLocalStorage(
    'scaling-activity-show-mainnet',
    true,
  )

  const { data: scalingFactor } = api.activity.scalingFactor.useQuery({
    filter: filters.isEmpty
      ? { type: 'all' }
      : {
          type: 'projects',
          projectIds: entries
            .filter(includeFilter)
            .map((project) => project.id),
        },
  })
  const { data, isLoading } = api.activity.chart.useQuery({
    range: timeRange,
    filter: filters.isEmpty
      ? { type: 'all' }
      : {
          type: 'projects',
          projectIds: entries
            .filter(includeFilter)
            .map((project) => project.id),
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
      useLogScale={scale === 'log'}
    >
      <section className="flex flex-col gap-4">
        <ActivityChartHeader scalingFactor={scalingFactor} range={chartRange} />
        <Chart />
        <ChartControlsWrapper>
          <div className="flex gap-2 md:gap-4">
            <RadioGroup
              value={scale}
              onValueChange={(value) => setScale(value as ChartScale)}
            >
              <RadioGroupItem value="log">LOG</RadioGroupItem>
              <RadioGroupItem value="lin">LIN</RadioGroupItem>
            </RadioGroup>
            <Checkbox
              id="show-mainnet"
              checked={showMainnet}
              onCheckedChange={(state) => setShowMainnet(!!state)}
            >
              <div className="flex flex-row items-center gap-2">
                <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
                <span className="hidden md:inline">
                  ETH Mainnet Transactions
                </span>
                <span className="md:hidden">ETH Txs</span>
              </div>
            </Checkbox>
          </div>
          <ActivityTimeRangeControls
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        </ChartControlsWrapper>
      </section>
    </ChartProvider>
  )
}
