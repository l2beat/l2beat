'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import type { TooltipProps } from 'recharts'

import type { ChartConfig } from '~/components/core/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  useChart,
} from '~/components/core/chart'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { formatTimestamp } from '~/utils/dates'

interface DataPoint {
  timestamp: number
  ethereum: number
  celestia: number
  avail: number
}

interface TooltipPayload {
  value: number
  name: string
  fill: string
}

interface Props {
  data: DataPoint[] | undefined
  chartConfig: ChartConfig
}
export function DaAbsoluteThroughputChart({ data, chartConfig }: Props) {
  return (
    <ChartContainer config={chartConfig}>
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
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value: number) => formatTimestamp(value)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          mirror
          tick={{
            dy: -10,
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { config } = useChart()
  if (!active || !payload) return null
  return (
    <div className={tooltipContentVariants()}>
      <div className="text-secondary">{label}</div>
      <div className="grid gap-1.5">
        {(payload as TooltipPayload[]).map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div
                className="size-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-secondary">
                {config[entry.name]?.label}
              </span>
            </div>
            <span className="font-mono font-medium tabular-nums text-primary">
              {entry.value.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
