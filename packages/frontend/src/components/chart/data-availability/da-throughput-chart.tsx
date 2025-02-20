'use client'

import { useMemo, useState } from 'react'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import { ChartTimeRange } from '../../core/chart/chart-time-range'
import { ChartTimeRangeControls } from '../../core/chart/chart-time-range-controls'
import { getChartRange } from '../../core/chart/utils/get-chart-range-from-columns'
import { DaAbsoluteThroughputChart } from './da-absolute-throughput-chart'
import { DaPercentageThroughputChart } from './da-percentage-throughput-chart'

export function DaThroughputChart() {
  const [range, setRange] = useState<DaThroughputTimeRange>('30d')
  const [metric, setMetric] = useState<'percentage' | 'absolute'>('percentage')
  const { data, isLoading } = api.da.chart.useQuery({
    range,
  })
  const chartRange = useMemo(
    () => getChartRange(data?.map(([timestamp]) => ({ timestamp }))),
    [data],
  )

  return (
    <div>
      <div className="mb-4">
        <h1 className="whitespace-nowrap text-xl font-bold max-md:ml-1 md:text-2xl">
          {metric === 'percentage'
            ? 'Share of total data posted'
            : 'Total data posted'}
        </h1>
        <ChartTimeRange range={chartRange} />
      </div>
      {metric === 'percentage' ? (
        <DaPercentageThroughputChart data={data} isLoading={isLoading} />
      ) : (
        <DaAbsoluteThroughputChart data={data} isLoading={isLoading} />
      )}
      <div className="mt-2 flex justify-between">
        <RadioGroup
          name="metric"
          value={metric}
          onValueChange={(v) => setMetric(v as 'percentage' | 'absolute')}
        >
          <RadioGroupItem value="percentage">Percentage</RadioGroupItem>
          <RadioGroupItem value="absolute">Absolute</RadioGroupItem>
        </RadioGroup>
        <ChartTimeRangeControls
          name="Range"
          value={range}
          setValue={setRange}
          options={Object.values(DaThroughputTimeRange.Enum).map((v) => ({
            value: v,
            label: v.toUpperCase(),
          }))}
        />
      </div>
    </div>
  )
}
