'use client'

import { assert } from '@l2beat/shared-pure'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartConfig } from '~/components/core/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartLoader,
  ChartTooltip,
  useChart,
} from '~/components/core/chart'
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
  chartConfig: ChartConfig
}
export function DaPercentageThroughputChart({ data, chartConfig }: Props) {
  const chartData = data?.map((item) => {
    const total = item.ethereum + item.celestia + item.avail
    const ethereumPercent = (item.ethereum / total) * 100
    const celestiaPercent = (item.celestia / total) * 100
    const availPercent = Math.min(
      (item.avail / total) * 100,
      100 - ethereumPercent - celestiaPercent,
    )

    return {
      timestamp: item.timestamp,
      ethereum: ethereumPercent,
      celestia: celestiaPercent,
      avail: availPercent,
    }
  })

  return (
    <ChartContainer config={chartConfig}>
      {chartData ? (
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
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatTimestamp(value)}
            minTickGap={32}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            unit="%"
            mirror
            tickCount={3}
            tick={{
              dy: -10,
            }}
          />
        </BarChart>
      ) : (
        <ChartLoader />
      )}
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
