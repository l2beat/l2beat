import { Area, AreaChart } from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/formatCurrency'

interface PrivacyTvlChartDataPoint {
  timestamp: number
  value: number
}

interface Props {
  data: PrivacyTvlChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
}

const chartMeta = {
  value: {
    label: 'TVL',
    color: 'var(--chart-pink)',
    indicatorType: { shape: 'line' },
  },
} satisfies ChartMeta

export function PrivacyTvlChart({ data, syncedUntil, isLoading }: Props) {
  return (
    <ChartContainer data={data} meta={chartMeta} isLoading={isLoading}>
      <AreaChart responsive data={data} margin={{ top: 20 }}>
        <defs>
          <PinkFillGradientDef id="privacy-tvl-fill" />
          <PinkStrokeGradientDef id="privacy-tvl-stroke" />
        </defs>
        <Area
          dataKey="value"
          fill="url(#privacy-tvl-fill)"
          fillOpacity={1}
          stroke="url(#privacy-tvl-stroke)"
          strokeWidth={2}
          isAnimationActive={false}
        />
        <ChartTooltip filterNull={false} content={<PrivacyTvlChartTooltip />} />
        <ChartCommonComponents
          data={data}
          isLoading={isLoading}
          yAxis={{
            tickCount: 4,
            tickFormatter: (value) => formatCurrency(Number(value), 'usd'),
          }}
          syncedUntil={syncedUntil}
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  )
}

function PrivacyTvlChartTooltip({ payload, label }: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="font-medium text-label-value-14 text-secondary">
        {formatTimestamp(label, {
          longMonthName: true,
          mode: 'datetime',
        })}
      </div>
      <HorizontalSeparator className="my-2" />
      <div className="flex flex-col gap-2">
        {payload.map((entry) => {
          if (entry.name === undefined || entry.hide || entry.type === 'none') {
            return null
          }

          const config = meta[entry.name]
          if (!config) return null

          return (
            <div
              key={entry.name}
              className="flex items-center justify-between gap-x-6"
            >
              <div className="flex items-center gap-1">
                <ChartDataIndicator
                  type={config.indicatorType}
                  backgroundColor={config.color}
                />
                <span className="font-medium text-label-value-14">
                  {config.label}
                </span>
              </div>
              <span className="font-medium text-label-value-15 text-primary tabular-nums">
                {formatCurrency(Number(entry.value ?? 0), 'usd')}
              </span>
            </div>
          )
        })}
      </div>
    </ChartTooltipWrapper>
  )
}
