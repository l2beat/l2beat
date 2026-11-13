import { formatActivityCount, UnixTime } from '@l2beat/shared-pure'
import round from 'lodash/round'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import {
  ChartTooltipRow,
  ChartTooltipValue,
  ChartTooltipWrapper,
} from '~/components/core/chart/ChartTooltip'
import {
  type ChartXAxis,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { tinted } from '~/components/core/chart/tint'
import type { ActivityResolution } from '~/server/features/layer2s/activity/utils/getActivityResolution'
import { formatRange } from '~/utils/dates'
import { getActivityPeriodSeconds } from './utils/getActivityPeriodSeconds'

interface ActivityRatioChartDataPoint {
  timestamp: number
  ratio: number | null
}

interface Props {
  data: ActivityRatioChartDataPoint[] | undefined
  syncedUntil: number | undefined
  resolution?: ActivityResolution
  isLoading: boolean
  isPlaceholderData: boolean
  /** Of the newest block, when the last period is under way */
  liveUntil?: number
  xAxis?: ChartXAxis
  /** The period a point covers, by default the resolution's */
  formatPeriod?: (timestamp: number) => string
}

export function ActivityRatioChart({
  data,
  isLoading,
  isPlaceholderData,
  syncedUntil,
  resolution = 'day',
  liveUntil,
  xAxis,
  formatPeriod,
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
          },
        ]}
        yAxis={{
          format: (value) => `${round(value, 2)}x`,
          domain: [1, 'auto'],
          headroom: 0.1,
        }}
        xAxis={xAxis}
        syncedUntil={syncedUntil}
        renderTooltip={(row) => (
          <ActivityCustomTooltip
            row={row}
            resolution={resolution}
            liveUntil={liveUntil}
            formatPeriod={formatPeriod}
          />
        )}
      />
    </ChartContainer>
  )
}

function ActivityCustomTooltip({
  row,
  resolution,
  liveUntil,
  formatPeriod,
}: {
  row: ActivityRatioChartDataPoint
  resolution: ActivityResolution
  liveUntil: number | undefined
  formatPeriod: ((timestamp: number) => string) | undefined
}) {
  const timestamp = row.timestamp
  const seconds = getActivityPeriodSeconds(timestamp, resolution, liveUntil)

  return (
    <ChartTooltipWrapper>
      <div className="flex w-40 flex-col sm:w-60">
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatPeriod ? (
            formatPeriod(timestamp)
          ) : (
            <>
              {formatRange(timestamp, timestamp + seconds)}
              {seconds < UnixTime.periodToSeconds(resolution) && ' so far'}
            </>
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
