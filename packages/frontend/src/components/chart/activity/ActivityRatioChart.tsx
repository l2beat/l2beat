import { assert, UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart } from 'recharts'
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
import { formatRange } from '~/utils/dates'
import { formatActivityCount } from '~/utils/number-format/formatActivityCount'

interface ActivityRatioChartDataPoint {
  timestamp: number
  ratio: number | null
}

interface Props {
  data: ActivityRatioChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  className?: string
}

export function ActivityRatioChart({
  data,
  isLoading,
  syncedUntil,
  className,
}: Props) {
  const chartMeta = {
    ratio: {
      label: 'UOPS/TPS Ratio',
      color: 'var(--chart-emerald)',
      indicatorType: {
        shape: 'line',
      },
    },
  } satisfies ChartMeta
  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={undefined}
      size="small"
    >
      <AreaChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <Area
          dataKey="ratio"
          fillOpacity={1}
          fill="url(#fillRatio)"
          strokeWidth={2}
          stroke={chartMeta.ratio.color}
          dot={false}
          isAnimationActive={false}
        />

        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tickFormatter: (value) => `${round(value, 2)}x`,
            domain: ([_, dataMax]) => [1, dataMax + (dataMax - 1) * 0.1],
          },
          syncedUntil,
        })}

        <ChartTooltip filterNull={false} content={<ActivityCustomTooltip />} />
        <ChartLegend content={<ChartLegendContent />} />
        <defs>
          <EmeraldFillGradientDef id="fillRatio" />
        </defs>
      </AreaChart>
    </ChartContainer>
  )
}

function ActivityCustomTooltip({
  active,
  payload,
  label: timestamp,
}: TooltipProps<number, string>) {
  const { meta } = useChart()
  if (!active || !payload || typeof timestamp !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(timestamp, timestamp + UnixTime.DAY)}
        </div>
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
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
                  {entry.value === null
                    ? 'No data'
                    : formatActivityCount(entry.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
