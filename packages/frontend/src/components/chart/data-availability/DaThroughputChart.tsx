import { useMemo, useState } from 'react'
import { Checkbox } from '~/components/core/Checkbox'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { useIncludeScalingOnly } from '~/pages/data-availability/throughput/components/DaThroughputContext'
import {
  type DaThroughputTimeRange,
  DaThroughputTimeRangeValues,
  rangeToResolution,
} from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import { ChartTimeRange } from '../../core/chart/ChartTimeRange'
import { ChartTimeRangeControls } from '../../core/chart/ChartTimeRangeControls'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { DaAbsoluteThroughputChart } from './DaAbsoluteThroughputChart'
import { DaPercentageThroughputChart } from './DaPercentageThroughputChart'

export function DaThroughputChart() {
  const [range, setRange] = useState<DaThroughputTimeRange>('1y')
  const [metric, setMetric] = useState<'percentage' | 'absolute'>('percentage')
  const { includeScalingOnly, setIncludeScalingOnly } = useIncludeScalingOnly()

  const { data: chartData, isLoading } = api.da.chart.useQuery({
    range,
    includeScalingOnly,
  })

  const chartRange = useMemo(
    () => getChartRange(chartData?.data.map(([timestamp]) => ({ timestamp }))),
    [chartData],
  )

  const resolution = rangeToResolution({ type: range })

  return (
    <div>
      <div className="mb-4">
        <h1 className="whitespace-nowrap font-bold text-xl md:text-2xl">
          {metric === 'percentage'
            ? 'Share of total data posted'
            : 'Total data posted'}
        </h1>
        <ChartTimeRange range={chartRange} />
      </div>
      {metric === 'percentage' ? (
        <DaPercentageThroughputChart
          data={chartData?.data}
          isLoading={isLoading}
          includeScalingOnly={includeScalingOnly}
          syncStatus={chartData?.syncStatus}
          resolution={resolution}
          range={range}
        />
      ) : (
        <DaAbsoluteThroughputChart
          data={chartData?.data}
          isLoading={isLoading}
          includeScalingOnly={includeScalingOnly}
          syncStatus={chartData?.syncStatus}
          resolution={resolution}
        />
      )}
      <div className="mt-2 flex justify-between gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <RadioGroup
            name="metric"
            value={metric}
            onValueChange={(v) => setMetric(v as 'percentage' | 'absolute')}
          >
            <RadioGroupItem value="percentage">Percentage</RadioGroupItem>
            <RadioGroupItem value="absolute">Absolute</RadioGroupItem>
          </RadioGroup>
          <Checkbox
            name="include-scaling-only"
            checked={includeScalingOnly}
            onCheckedChange={(checked) =>
              setIncludeScalingOnly(
                checked === 'indeterminate' ? false : checked,
              )
            }
          >
            <span className="max-lg:hidden">
              Include only projects scaling Ethereum
            </span>
            <span className="lg:hidden">Ethereum scaling projects only</span>
          </Checkbox>
        </div>
        <ChartTimeRangeControls
          name="Range"
          value={range}
          setValue={setRange}
          options={Object.values(DaThroughputTimeRangeValues).map((v) => ({
            value: v,
            label: v.toUpperCase(),
          }))}
        />
      </div>
    </div>
  )
}
