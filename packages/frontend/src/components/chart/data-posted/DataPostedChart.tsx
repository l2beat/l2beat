import { assert } from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, ComposedChart, Line } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { EmeraldFillGradientDef } from '~/components/core/chart/defs/EmeraldGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { formatTimestamp } from '~/utils/dates'
import { formatBytes } from '~/utils/number-format/formatBytes'

interface DataPostedChartDataPoint {
  timestamp: number
  posted: number | null
  estimatedPosted: number | null
}

interface Props {
  data: DataPostedChartDataPoint[] | undefined
  isLoading: boolean
  className?: string
  tickCount?: number
}

export function DataPostedChart({
  data,
  isLoading,
  className,
  tickCount,
}: Props) {
  const chartMeta = {
    posted: {
      label: 'Data posted',
      color: 'var(--chart-emerald)',
      indicatorType: {
        shape: 'line',
      },
    },
    estimatedPosted: {
      label: 'Data posted (estimated)',
      color: 'var(--chart-emerald)',
      indicatorType: { shape: 'line', strokeDasharray: '3 3' },
    },
  } satisfies ChartMeta

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
    >
      <ComposedChart data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="posted"
          fill="url(#fillPosted)"
          fillOpacity={1}
          stroke={chartMeta.posted.color}
          strokeWidth={2}
          isAnimationActive={false}
          dot={false}
        />
        <Line
          dataKey="estimatedPosted"
          strokeWidth={2}
          stroke={chartMeta.estimatedPosted.color}
          strokeDasharray={
            chartMeta.estimatedPosted.indicatorType.strokeDasharray
          }
          dot={false}
          isAnimationActive={false}
          legendType="none"
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tickCount,
            tickFormatter: (value: number) => formatBytes(value),
          },
          // There is always some data because of the estimation
          syncedUntil: undefined,
        })}
        <ChartTooltip content={<DataPostedCustomTooltip />} />
        <defs>
          <EmeraldFillGradientDef id="fillPosted" />
        </defs>
      </ComposedChart>
    </ChartContainer>
  )
}

export function DataPostedCustomTooltip({
  active,
  payload,
  label: timestamp,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null

  const dataKeys = payload.map((p) => p.dataKey)
  const hasPostedAndEstimated =
    dataKeys.includes('posted') && dataKeys.includes('estimatedPosted')
  const filteredPayload = payload.filter(
    (p) => !hasPostedAndEstimated || p.name !== 'estimatedPosted',
  )
  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatTimestamp(timestamp, {
            mode: 'datetime',
          })}
        </div>
        <div className="flex flex-col gap-2">
          {filteredPayload.map((entry) => {
            if (
              entry.name === undefined ||
              entry.value === undefined ||
              entry.type === 'none'
            )
              return null
            const config = meta[entry.name]
            assert(config, 'No config')

            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 font-medium text-label-value-14 sm:w-fit">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {formatBytes(entry.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
