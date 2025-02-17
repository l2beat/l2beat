'use client'

import { assert } from '@l2beat/shared-pure'
import { round } from 'lodash'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import { getXAxisProps } from '~/components/core/chart/get-x-axis-props'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { formatTimestamp } from '~/utils/dates'

interface DataPoint {
  timestamp: number
  ethereum: number
  celestia: number
  avail: number
}

interface Props {
  data: DataPoint[] | undefined
  isLoading: boolean
  chartConfig: ChartConfig
}
export function DaPercentageThroughputChart({
  data,
  isLoading,
  chartConfig,
}: Props) {
  const chartData = data?.map((item) => {
    const total = item.ethereum + item.celestia + item.avail

    return {
      timestamp: item.timestamp,
      ethereum: round((item.ethereum / total) * 100, 2),
      celestia: round((item.celestia / total) * 100, 2),
      avail: round((item.avail / total) * 100, 2),
    }
  })

  return (
    <ChartContainer config={chartConfig} className="mb-2" isLoading={isLoading}>
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="ethereum"
          stackId="a"
          fill="var(--color-ethereum)"
          isAnimationActive={false}
        />

        <Bar
          dataKey="celestia"
          stackId="a"
          fill="var(--color-celestia)"
          isAnimationActive={false}
        />
        <Bar
          dataKey="avail"
          stackId="a"
          fill="var(--color-avail)"
          isAnimationActive={false}
        />
        <CartesianGrid vertical={false} horizontal={true} />
        <XAxis {...getXAxisProps(chartData)} />
        <YAxis
          tickLine={false}
          axisLine={false}
          unit="%"
          domain={[0, 100]}
          allowDataOverflow
          mirror
          tickCount={3}
          tick={{
            dy: -10,
          }}
        />
      </BarChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <div className={tooltipContentVariants()}>
      <div className="text-secondary">
        {formatTimestamp(label, { mode: 'datetime' })}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="grid">
        {payload.map((entry, index) => {
          const configEntry = entry.name ? config[entry.name] : undefined
          assert(configEntry, 'Config entry not found')

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <div
                  className="size-3 shrink-0 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-secondary">{configEntry.label}</span>
              </div>
              <span className="font-medium tabular-nums text-primary">
                {entry.value?.toFixed(1)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
