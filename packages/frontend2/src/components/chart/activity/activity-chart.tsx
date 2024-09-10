'use client'

import { type Milestone } from '@l2beat/config'
import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(new)/(other)/_components/scaling-filter-context'
import { useActivityTimeRangeContext } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-context'
import { ActivityTimeRangeControls } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-controls'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { type ScalingActivityEntry } from '~/server/features/scaling/get-scaling-activity-entries'
import { api } from '~/trpc/react'
import { Checkbox } from '../../core/checkbox'
import { RadioGroup, RadioGroupItem } from '../../core/radio-group'
import { Chart } from '../core/chart'
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
      chart: data,
      showMainnet,
    })

  const totalTxs = data?.reduce(
    (acc, curr) => {
      acc.ethereum += curr[2]
      acc.rest += curr[1]
      return acc
    },
    { ethereum: 0, rest: 0 },
  )

  const scalingFactor =
    totalTxs &&
    ((totalTxs.rest ?? 0) + (totalTxs.ethereum ?? 0)) / (totalTxs.ethereum ?? 1)

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
        <ActivityChartHeader scalingFactor={scalingFactor} range={timeRange} />
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
