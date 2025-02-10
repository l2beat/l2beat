'use client'

import { useState } from 'react'
import type { ChartConfig } from '~/components/core/chart'
import { RadioGroup, RadioGroupItem } from '~/components/core/radio-group'
import { PrimaryCard } from '~/components/primary-card'
import { DaThroughputTimeRange } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/react'
import { ChartTimeRangeControls } from '../core/chart-time-range-controls'
import { DaAbsoluteThroughputChart } from './da-absolute-throughput-chart'
import { DaPercentageThroughputChart } from './da-percentage-throughput-chart'

const chartConfig = {
  ethereum: {
    label: 'Ethereum (blobs)',
    color: 'hsl(var(--chart-ethereum))',
  },
  celestia: {
    label: 'Celestia',
    color: 'hsl(var(--chart-da-celestia))',
  },
  avail: {
    label: 'Avail',
    color: 'hsl(var(--chart-da-avail))',
  },
} satisfies ChartConfig

export function DaThroughputChart() {
  const [range, setRange] = useState<DaThroughputTimeRange>('30d')
  const [metric, setMetric] = useState<'percentage' | 'absolute'>('absolute')
  const { data } = api.da.chart.useQuery({
    range,
  })

  return (
    <PrimaryCard>
      <h1 className="whitespace-nowrap text-xl font-bold max-md:ml-1 md:text-2xl">
        Share of total data posted
      </h1>
      {metric === 'percentage' ? (
        <DaPercentageThroughputChart data={data} chartConfig={chartConfig} />
      ) : (
        <DaAbsoluteThroughputChart data={data} chartConfig={chartConfig} />
      )}
      <div className="flex justify-between">
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
    </PrimaryCard>
  )
}
