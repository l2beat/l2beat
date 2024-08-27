'use client'

import {
  useScalingFilter,
  useScalingFilterValues,
} from '~/app/(new)/(other)/_components/scaling-filter-context'
import { useActivityTimeRangeContext } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-context'
import { ActivityTimeRangeControls } from '~/app/(new)/(other)/scaling/activity/_components/activity-time-range-controls'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { api } from '~/trpc/react'
import { useActivityChartRenderParams } from './use-activity-chart-render-params'
import { ChartProvider } from '../core/chart-provider'
import { Chart } from '../core/chart'
import { Checkbox } from '../../checkbox'
import { formatTpsWithUnit } from '~/utils/format-tps'
import { ActivityChartHeader } from './activity-chart-header'
import { EthereumLineIcon } from '~/icons/ethereum-line-icon'
import { ScalingFilters } from '~/app/(new)/(other)/_components/scaling-filters'

export function ActivityChart() {
  const { timeRange, setTimeRange } = useActivityTimeRangeContext()
  const filters = useScalingFilterValues()
  const includeFilter = useScalingFilter()
  const [scale, setScale] = useLocalStorage('scaling-tvl-scale', 'lin')
  const [showMainnet, setShowMainnet] = useLocalStorage(
    'scaling-activity-show-mainnet',
    true,
  )

  const { data, isLoading } = api.scaling.activity.chart.useQuery({
    range: timeRange,
    filter: { type: 'all' },
  })

  const { columns, valuesStyle, chartRange } = useActivityChartRenderParams({
    milestones: [],
    unit: 'usd',
    chart: data?.data,
    showMainnet,
  })

  return (
    <ChartProvider
      columns={columns}
      valuesStyle={valuesStyle}
      formatYAxisLabel={(value: number) => formatTpsWithUnit(value)}
      range={chartRange}
      useLogScale={scale === 'log'}
      isLoading={isLoading}
      renderHoverContents={(data) => JSON.stringify(data)}
    >
      <section className="flex flex-col gap-4">
        <ActivityChartHeader
          unit={scale}
          value={265}
          change={0.1}
          range={timeRange}
        />
        <ActivityTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          range={chartRange}
        />
        <Chart />
        <Checkbox
          id={'show-mainnet'}
          onCheckedChange={(state) => setShowMainnet(!!state)}
        >
          <div className="flex flex-row items-center gap-2">
            <EthereumLineIcon className="hidden h-1.5 w-2.5 sm:inline-block" />
            ETH Mainnet Transactions
          </div>
        </Checkbox>
      </section>
    </ChartProvider>
  )
}
