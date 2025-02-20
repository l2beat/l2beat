'use client'

import { assert } from '@l2beat/shared-pure'
import { useMemo } from 'react'
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
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import type { DaThroughputDataPoint } from '~/server/features/data-availability/throughput/get-da-throughput-chart'
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './get-da-data-params'
import { getDaChartMeta } from './meta'

interface Props {
  data: DaThroughputDataPoint[] | undefined
  isLoading: boolean
}

export function DaAbsoluteThroughputChart({ data, isLoading }: Props) {
  const chartMeta = getDaChartMeta({ shape: 'line' })
  const { denominator, unit } = getDaDataParams(data)
  const chartData = useMemo(() => {
    return data?.map(([timestamp, ethereum, celestia, avail]) => {
      return {
        timestamp,
        ethereum: ethereum / denominator,
        celestia: celestia / denominator,
        avail: avail / denominator,
      }
    })
  }, [data, denominator])

  return (
    <ChartContainer data={chartData} meta={chartMeta} isLoading={isLoading}>
      <LineChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="ethereum"
          isAnimationActive={false}
          stroke={chartMeta.ethereum.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="celestia"
          isAnimationActive={false}
          stroke={chartMeta.celestia.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          dataKey="avail"
          isAnimationActive={false}
          stroke={chartMeta.avail.color}
          strokeWidth={2}
          dot={false}
        />
        {getCommonChartComponents({
          data: chartData,
          isLoading,
          yAxis: {
            unit: ` ${unit}`,
            tickCount: 3,
            tick: {
              width: 100,
            },
          },
        })}
        <ChartTooltip content={<CustomTooltip unit={unit} />} />
      </LineChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  unit,
}: TooltipProps<number, string> & { unit: string }) {
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
                <ChartDataIndicator
                  backgroundColor={configEntry.color}
                  type={configEntry.indicatorType}
                />
                <span className="text-secondary">{configEntry.label}</span>
              </div>
              <span className="font-medium tabular-nums text-primary">
                {entry.value?.toFixed(2)} {unit}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
