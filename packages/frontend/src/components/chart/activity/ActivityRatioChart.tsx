import { formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import { TimeSeriesChart } from '~/components/core/chart/TimeSeriesChart'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import { formatRange } from '~/utils/dates'

interface ActivityRatioChartDataPoint {
  timestamp: number
  ratio: number | null
}

interface Props {
  data: ActivityRatioChartDataPoint[] | undefined
  syncedUntil: number | undefined
  resolution?: ActivityResolution
  isLoading: boolean
}

export function ActivityRatioChart({
  data,
  isLoading,
  syncedUntil,
  resolution = 'day',
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
            stroke: chartMeta.ratio.color,
            fill: CHART_GRADIENTS.emerald.fill,
          },
        ]}
        yAxis={{
          format: (value) => `${round(value, 2)}x`,
          domain: [1, 'auto'],
          headroom: 0.1,
        }}
        syncedUntil={syncedUntil}
        renderTooltip={(row) => (
          <ActivityCustomTooltip row={row} resolution={resolution} />
        )}
      />
    </ChartContainer>
  )
}

function ActivityCustomTooltip({
  row,
  resolution,
}: {
  row: ActivityRatioChartDataPoint
  resolution: ActivityResolution
}) {
  const timestamp = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(
            timestamp,
            timestamp + UnixTime.periodToSeconds(resolution),
          )}
        </div>
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
