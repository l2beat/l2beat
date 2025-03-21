import type { Milestone } from '@l2beat/config'
import type { TrackedTxsConfigSubtype } from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, ComposedChart, Scatter } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import { PinkStrokeGradientDef } from '~/components/core/chart/defs/pink-gradient-def'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import {
  type LivenessProjectTimeRange,
  type LivenessResolution,
  rangeToResolution,
} from '~/server/features/scaling/liveness/utils/range'
import { formatTimestamp } from '~/utils/dates'

const chartMeta = {
  interval: {
    label: 'Submission interval',
    color: 'hsl(var(--chart-stacked-pink))',
    indicatorType: { shape: 'square' },
  },
  mean: {
    label: 'Average interval',
    color: 'hsl(187deg 92.8% 49.2%)',
    indicatorType: { shape: 'square' },
  },
  zScoreBoundary: {
    label: 'Z-score boundary',
    color: 'hsl(25.4deg 100% 60.6%)',
    indicatorType: { shape: 'line', strokeDasharray: '9 3' },
  },
  anomaly: {
    label: 'Anomaly',
    color: 'hsl(10.7deg 94.7% 55.9%)',
    indicatorType: { shape: 'square' },
  },
} satisfies ChartMeta

interface LivenessChartDataPoint {
  timestamp: number
  interval: number
  mean: number
  zScoreBoundary: number
  anomaly: number | null
}

interface Props {
  data: LivenessChartDataPoint[] | undefined
  subtype: TrackedTxsConfigSubtype
  isLoading: boolean
  milestones: Milestone[]
  range: LivenessProjectTimeRange
  className?: string
  showZScore: boolean
}

export function LivenessChart({
  data,
  subtype,
  isLoading,
  milestones,
  className,
  range,
  showZScore,
}: Props) {
  const resolution = rangeToResolution(range)

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      className={className}
    >
      <ComposedChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent reverse />} />
        <Area
          isAnimationActive={false}
          strokeWidth={2}
          dataKey="interval"
          stroke="url(#interval)"
          fill="none"
        />
        <Area
          isAnimationActive={false}
          strokeWidth={2}
          dataKey="mean"
          stroke={chartMeta.mean.color}
          fill="none"
        />
        {showZScore && (
          <Area
            isAnimationActive={false}
            strokeWidth={2}
            dataKey="zScoreBoundary"
            stroke={chartMeta.zScoreBoundary.color}
            fill="none"
            strokeDasharray={
              chartMeta.zScoreBoundary?.indicatorType.strokeDasharray
            }
          />
        )}
        <Scatter
          dataKey="anomaly"
          fill={chartMeta.zScoreBoundary.color}
          shape="circle"
          isAnimationActive={false}
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tick: {
              width: 100,
            },
            tickFormatter: (value: number) => `${value}s`,
          },
        })}

        <ChartTooltip
          content={<CustomTooltip subtype={subtype} resolution={resolution} />}
        />
        <defs>
          <PinkStrokeGradientDef id="interval" />
        </defs>
      </ComposedChart>
    </ChartContainer>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
  subtype,
  resolution,
}: TooltipProps<number, string> & {
  subtype: TrackedTxsConfigSubtype
  resolution: LivenessResolution
}) {
  if (!active || !payload || typeof label !== 'number') return null
  const reversedPayload = [...payload].reverse()

  return (
    <ChartTooltipWrapper>
      <div className="flex min-w-44 flex-col gap-1">
        <div>
          {formatTimestamp(label, {
            mode: resolution === 'daily' ? 'date' : 'datetime',
            longMonthName: resolution === 'daily',
          })}
        </div>
        <div className="flex w-full items-center justify-between gap-2 text-xs text-secondary">
          <span>Total</span>
          {subtype}
          {/* <span className="whitespace-nowrap font-bold tabular-nums text-primary">
            {formatCostValue(total, unit, 'total')}
          </span> */}
        </div>
        <HorizontalSeparator />
        <div>
          {reversedPayload.map((entry) => {
            if (entry.value === undefined) return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="w-20 leading-none sm:w-fit">
                    {config.label}
                  </span>
                </span>
                {/* <span className="whitespace-nowrap font-medium">
                  {entry.name === 'posted'
                    ? formatBytes(entry.value)
                    : formatCostValue(entry.value, unit, 'total')}
                </span> */}
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
