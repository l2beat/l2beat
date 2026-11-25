import { formatActivityCount } from '@l2beat/shared-pure'
import type { Ref } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipTitle,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import {
  type ChartSeries,
  type ChartXAxis,
  TimeSeriesChart,
  type TimeSeriesChartHandle,
} from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'

interface ActivityRatioChartDataPoint {
  timestamp: number
  ratio: number | null
}

interface Props {
  data: ActivityRatioChartDataPoint[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  xAxis?: ChartXAxis
  /** The period a point covers, as its tooltip's title */
  formatPeriod: (timestamp: number) => string
  /** As `TimeSeriesChart`'s, for the live view's steps sliding with the clock */
  curve?: ChartSeries<'ratio'>['curve']
  clip?: boolean
  hover?: 'nearest' | 'before'
  handleRef?: Ref<TimeSeriesChartHandle>
}

export function ActivityRatioChart({
  data,
  isLoading,
  isPlaceholderData,
  syncedUntil,
  xAxis,
  formatPeriod,
  curve,
  clip,
  hover,
  handleRef,
}: Props) {
  const chartMeta = {
    ratio: {
      label: 'UOPS/TPS ratio',
      color: 'var(--chart-emerald)',
      indicatorType: {
        shape: 'line',
      },
    },
  } satisfies ChartMeta
  return (
    <ChartContainer
      isPlaceholderData={isPlaceholderData}
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={undefined}
      size="small"
      legend
    >
      <TimeSeriesChart
        data={data}
        ariaLabel="UOPS/TPS ratio"
        series={[
          {
            key: 'ratio',
            ...tinted(chartMeta.ratio.color),
            curve,
          },
        ]}
        yAxis={{
          format: (value) => `${value.toFixed(2)}x`,
          domain: [1, 'auto'],
          headroom: 0.1,
        }}
        xAxis={xAxis}
        syncedUntil={syncedUntil}
        clip={clip}
        hover={hover}
        handleRef={handleRef}
        renderTooltip={(row) => (
          <ActivityCustomTooltip row={row} formatPeriod={formatPeriod} />
        )}
      />
    </ChartContainer>
  )
}

function ActivityCustomTooltip({
  row,
  formatPeriod,
}: {
  row: ActivityRatioChartDataPoint
  formatPeriod: (timestamp: number) => string
}) {
  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <ChartTooltipTitle className="mb-3 whitespace-nowrap">
          {formatPeriod(row.timestamp)}
        </ChartTooltipTitle>
        <div className="flex flex-col gap-2">
          <ChartTooltipRow name="ratio">
            <ChartTooltipValue
              value={row.ratio}
              format={formatActivityCount}
              className="tabular-nums"
            />
          </ChartTooltipRow>
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
