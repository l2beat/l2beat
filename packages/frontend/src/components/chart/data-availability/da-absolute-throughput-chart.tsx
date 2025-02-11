'use client'

import { assert } from '@l2beat/shared-pure'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartConfig } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart/chart'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { formatTimestamp } from '~/utils/dates'
import { ChartLoader } from '../core/chart-loader'

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
export function DaAbsoluteThroughputChart({ data, chartConfig }: Props) {
  return (
    <ChartContainer config={chartConfig} className="mb-2">
      {data ? (
        <LineChart accessibilityLayer data={data} margin={{ top: 20 }}>
          <ChartTooltip content={<CustomTooltip />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="ethereum"
            type="natural"
            isAnimationActive={false}
            stroke="var(--color-ethereum)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="celestia"
            type="natural"
            isAnimationActive={false}
            stroke="var(--color-celestia)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            dataKey="avail"
            type="natural"
            isAnimationActive={false}
            stroke="var(--color-avail)"
            strokeWidth={2}
            dot={false}
          />
          <CartesianGrid vertical={false} horizontal={true} />
          <XAxis
            dataKey="timestamp"
            tickLine={false}
            axisLine={false}
            minTickGap={32}
            tickFormatter={(value: number) => formatTimestamp(value)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            mirror
            tickCount={3}
            tick={{
              dy: -10,
            }}
          />
        </LineChart>
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
      <div className="text-secondary">{formatTimestamp(label)}</div>
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
                {entry.value?.toFixed(1)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
