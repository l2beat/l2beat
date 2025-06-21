import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'

import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EigenFillGradientDef } from '~/components/core/chart/defs/EigenGradientDef'
import { EmeraldFillGradientDef } from '~/components/core/chart/defs/EmeraldGradientDef'
import {
  EthereumFillGradientDef,
  EthereumStrokeGradientDef,
} from '~/components/core/chart/defs/EthereumGradientDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/GetCommonChartComponents'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/GetStrokeOverFillAreaComponents'
import type { DaThroughputDataPoint } from '~/server/features/data-availability/throughput/getDaThroughputChart'
import { formatTimestamp } from '~/utils/dates'
import { getDaDataParams } from './getDaDataParams'
import { getDaChartMeta } from './meta'

interface Props {
  data: DaThroughputDataPoint[] | undefined
  isLoading: boolean
}

export function DaAbsoluteThroughputChart({ data, isLoading }: Props) {
  const chartMeta = getDaChartMeta({ shape: 'line' })
  const max = useMemo(() => {
    return data
      ? Math.max(
          ...data.map(([_, ...rest]) =>
            Math.max(...rest.filter((x) => x !== null)),
          ),
        )
      : undefined
  }, [data])
  const { denominator, unit } = getDaDataParams(max)
  const chartData = useMemo(() => {
    return data?.map(([timestamp, ethereum, celestia, avail, eigenda]) => {
      return {
        timestamp,
        ethereum: ethereum / denominator,
        celestia: celestia / denominator,
        avail: avail / denominator,
        eigenda: eigenda / denominator,
      }
    })
  }, [data, denominator])

  return (
    <ChartContainer data={chartData} meta={chartMeta} isLoading={isLoading}>
      <AreaChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
        <defs>
          <EthereumFillGradientDef id="ethereum-fill" />
          <EthereumStrokeGradientDef id="ethereum-stroke" />
          <PinkFillGradientDef id="pink-fill" />
          <PinkStrokeGradientDef id="pink-stroke" />
          <EmeraldFillGradientDef id="emerald-fill" />
          <EigenFillGradientDef id="eigenda-fill" />
        </defs>
        <ChartLegend content={<ChartLegendContent />} />
        {getStrokeOverFillAreaComponents({
          data: [
            {
              dataKey: 'ethereum',
              stroke: 'url(#ethereum-stroke)',
              fill: 'url(#ethereum-fill)',
            },
            {
              dataKey: 'celestia',
              stroke: 'url(#pink-stroke)',
              fill: 'url(#pink-fill)',
            },
            {
              dataKey: 'avail',
              stroke: chartMeta.avail.color,
              fill: 'url(#emerald-fill)',
            },
            {
              dataKey: 'eigenda',
              stroke: chartMeta.eigenda.color,
              fill: 'url(#eigenda-fill)',
            },
          ],
        })}
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
      </AreaChart>
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
      <div className="label-value-14-medium text-secondary">
        {formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
      </div>
      <HorizontalSeparator className="my-1" />
      <div className="flex flex-col gap-2">
        {payload.map((entry, index) => {
          if (entry.type === 'none') return null
          const configEntry = entry.name ? config[entry.name] : undefined
          if (!configEntry) return null
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
                <span className="label-value-14-medium">
                  {configEntry.label}
                </span>
              </div>
              <span className="label-value-15-medium text-primary tabular-nums">
                {entry.value?.toFixed(2)} {unit}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
