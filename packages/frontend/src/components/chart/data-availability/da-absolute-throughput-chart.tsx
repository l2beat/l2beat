'use client'

import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
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
import { getXAxisProps } from '~/components/core/chart/get-x-axis-props'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import type { DaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-da-throughput-chart'
import { formatTimestamp } from '~/utils/dates'

interface Props {
  data: DaThroughputDataPoint[] | undefined
  isLoading: boolean
  chartConfig: ChartConfig
}
export function DaAbsoluteThroughputChart({
  data,
  isLoading,
  chartConfig,
}: Props) {
  const chartData = useMemo(() => {
    return data?.map((item) => {
      return {
        ...item,
        ethereum: item.ethereum ?? 0,
        celestia: item.celestia ?? 0,
        avail: item.avail ?? 0,
      }
    })
  }, [data])
  return (
    <ChartContainer config={chartConfig} className="mb-2" isLoading={isLoading}>
      <LineChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="ethereum"
          isAnimationActive={false}
          stroke="var(--color-ethereum)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="celestia"
          isAnimationActive={false}
          stroke="var(--color-celestia)"
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="avail"
          isAnimationActive={false}
          stroke="var(--color-avail)"
          strokeWidth={2}
          dot={false}
        />
        <CartesianGrid vertical={false} horizontal={true} />
        <XAxis {...getXAxisProps(data)} />
        <YAxis
          tickLine={false}
          axisLine={false}
          mirror
          tickCount={3}
          tick={{
            width: 100,
            dy: -10,
          }}
          tickFormatter={formatBytes}
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
                {formatBytes(entry.value ?? 0)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }

  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}
