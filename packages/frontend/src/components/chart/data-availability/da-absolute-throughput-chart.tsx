'use client'

import { assert } from '@l2beat/shared-pure'
import { Line, LineChart } from 'recharts'
import type { TooltipProps } from 'recharts'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/chart'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { formatTimestamp } from '~/utils/dates'
import { daChartMeta } from './meta'

interface DataPoint {
  timestamp: number
  ethereum: number
  celestia: number
  avail: number
}

interface Props {
  data: DataPoint[] | undefined
  isLoading: boolean
}
export function DaAbsoluteThroughputChart({ data, isLoading }: Props) {
  return (
    <ChartContainer
      data={data}
      meta={daChartMeta}
      className="mb-2"
      isLoading={isLoading}
    >
      <LineChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartTooltip content={<CustomTooltip />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="ethereum"
          isAnimationActive={false}
          stroke={daChartMeta.ethereum.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="celestia"
          isAnimationActive={false}
          stroke={daChartMeta.celestia.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="avail"
          isAnimationActive={false}
          stroke={daChartMeta.avail.color}
          strokeWidth={2}
          dot={false}
        />
        {getCommonChartComponents({
          chartData: data,
          yAxis: {
            tick: {
              width: 100,
            },
            tickFormatter: (value: number) => formatBytes(value),
          },
        })}
      </LineChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  const { meta: config } = useChart()
  if (!active || !payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
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
    </ChartTooltipWrapper>
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
