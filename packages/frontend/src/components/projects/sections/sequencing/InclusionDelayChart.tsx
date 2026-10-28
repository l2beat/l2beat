import { formatSeconds } from '@l2beat/shared-pure'
import { scaleLog } from 'd3-scale'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import { type ChartMeta, useChart } from '~/components/core/chart/ChartContext'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import {
  type ChartReferenceDot,
  type ChartSeries,
  ChartTooltipWrapper,
  getTooltipEntries,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import type {
  InclusionDelayChartDataPoint,
  InclusionDelayEntityMarker,
  InclusionDelayThresholdMarker,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'
import { SECONDS_PER_DAY } from '~/utils/project/technology/inclusion-delay/shared'

export type InclusionDelayYAxisScale = 'linear' | 'log'

const INCLUSION_DELAY_ENTITY_MARKER_COLOR = 'var(--chart-cyan)'
const DELAY_THRESHOLD_COLOR = 'var(--chart-yellow)'

interface Props {
  data: InclusionDelayChartDataPoint[]
  chartMeta: ChartMeta
  maxCensorFraction: number
  yAxisScale: InclusionDelayYAxisScale
  thresholdMarkers?: InclusionDelayThresholdMarker[]
  entityMarkers?: InclusionDelayChartEntityMarker[]
  /**
   * 'detailed' labels each marker (single-project charts), 'points' renders
   * unlabeled series-colored dots (multi-series comparison charts).
   */
  entityMarkerMode?: 'detailed' | 'points'
}

export interface InclusionDelayChartEntityMarker
  extends InclusionDelayEntityMarker {
  color?: string
}

export function InclusionDelayChart({
  data,
  chartMeta,
  maxCensorFraction,
  yAxisScale,
  thresholdMarkers = [],
  entityMarkers = [],
  entityMarkerMode = 'detailed',
}: Props) {
  const dataKeys = Object.keys(chartMeta)
  const yDomain = getInclusionDelayYDomain(
    data,
    dataKeys,
    yAxisScale,
    thresholdMarkers,
  )

  const series: ChartSeries<string, InclusionDelayChartDataPoint>[] =
    dataKeys.flatMap((dataKey) => {
      const meta = chartMeta[dataKey]
      if (!meta || meta.indicatorType.shape !== 'line') return []
      return [
        {
          key: dataKey,
          stroke: meta.color,
          strokeDasharray: meta.indicatorType.strokeDasharray
            ? '5 5'
            : undefined,
          connectNulls: true,
        },
      ]
    })

  const referenceDots: ChartReferenceDot[] = [
    ...entityMarkers.map(
      (marker): ChartReferenceDot => ({
        x: marker.stakeFraction,
        y: marker.delayDays,
        r: 4.5,
        fill: marker.color ?? INCLUSION_DELAY_ENTITY_MARKER_COLOR,
        stroke: 'var(--background)',
        strokeWidth: 2,
        label:
          entityMarkerMode === 'detailed'
            ? {
                text: marker.label,
                position: 'top',
                fill: 'var(--primary)',
                fontSize: 11,
                fontWeight: 500,
                offset: 8,
              }
            : undefined,
      }),
    ),
    ...thresholdMarkers.map(
      (marker): ChartReferenceDot => ({
        x: marker.censoringFraction,
        y: marker.delayDays,
        r: 5.5,
        fill: 'transparent',
        stroke: DELAY_THRESHOLD_COLOR,
        strokeWidth: 2.5,
        label: {
          text: marker.label,
          position: 'bottom',
          fill: DELAY_THRESHOLD_COLOR,
          fontSize: 11,
          fontWeight: 500,
          offset: 8,
        },
      }),
    ),
  ]

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={false}
      legend
      legendLeading={
        entityMarkerMode === 'detailed' &&
        entityMarkers.length > 0 && (
          // `order-last`: after the series items.
          <div className="order-last flex shrink-0 items-center gap-[3px] pl-2">
            <ChartDataIndicator
              type={{ shape: 'square' }}
              backgroundColor={INCLUSION_DELAY_ENTITY_MARKER_COLOR}
            />
            <span className="text-nowrap font-medium text-2xs text-secondary leading-none tracking-[-0.2px]">
              Largest attributed entities
            </span>
          </div>
        )
      }
    >
      <TimeSeriesChart
        data={data}
        series={series}
        ariaLabel="Inclusion delay"
        x={getCensoringFraction}
        xAxis={{
          ticks: getFractionTicks(maxCensorFraction),
          format: formatCensoringFraction,
          domain: [0, maxCensorFraction],
        }}
        yAxis={{
          scale: yAxisScale === 'log' ? scaleLog : undefined,
          domain: () => yDomain,
          ticks:
            yAxisScale === 'log'
              ? getLogDelayTicks(yDomain[0], yDomain[1])
              : undefined,
          format: formatDelayDays,
          tickCount: yAxisScale === 'linear' ? 4 : 5,
        }}
        // Room for the x axis, plus 4px below it.
        margin={{ right: 8, bottom: 29 }}
        referenceDots={referenceDots}
        renderTooltip={(row, keys) => (
          <InclusionDelayTooltip row={row} keys={keys} />
        )}
      />
    </ChartContainer>
  )
}

function getCensoringFraction(row: InclusionDelayChartDataPoint) {
  return row.censoringFraction
}

function InclusionDelayTooltip({
  row,
  keys,
}: {
  row: InclusionDelayChartDataPoint
  keys: string[]
}) {
  const { meta } = useChart()
  const { censoringFraction } = row
  const rows = getTooltipEntries(row, keys).filter((entry) => meta[entry.name])

  return (
    <ChartTooltipWrapper>
      <div className="flex w-64 flex-col gap-2 font-medium text-label-value-14">
        <div>
          {formatCensoringFraction(censoringFraction)} censoring would incur a
          transaction inclusion delay of
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((entry) => {
            const dataKey = entry.name
            const item = meta[dataKey]
            if (!item) return null

            return (
              <div
                key={dataKey}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <ChartDataIndicator
                    type={item.indicatorType}
                    backgroundColor={item.color}
                  />
                  <span className="truncate text-secondary">{item.label}</span>
                </div>
                <span className="shrink-0 text-primary">
                  {formatTooltipDelay(entry.value)}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}

function getInclusionDelayYDomain(
  data: InclusionDelayChartDataPoint[],
  dataKeys: string[],
  scale: InclusionDelayYAxisScale,
  thresholdMarkers: InclusionDelayThresholdMarker[],
): [number, number] {
  const values = [
    ...data.flatMap((point) => dataKeys.map((key) => point[key])),
    ...thresholdMarkers.map((marker) => marker.delayDays),
  ].filter((value): value is number => typeof value === 'number' && value > 0)

  if (values.length === 0) {
    return scale === 'log' ? [1 / SECONDS_PER_DAY, 1] : [0, 1]
  }

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (scale === 'log') {
    return [min * 0.8, max === min ? max * 1.2 : max * 1.15]
  }

  return [0, max === 0 ? 1 : max * 1.1]
}

function getLogDelayTicks(
  minDays: number,
  maxDays: number,
): number[] | undefined {
  const ticksInSeconds = [
    1,
    2,
    5,
    10,
    30,
    60,
    5 * 60,
    15 * 60,
    60 * 60,
    6 * 60 * 60,
    SECONDS_PER_DAY,
    7 * SECONDS_PER_DAY,
    30 * SECONDS_PER_DAY,
    365 * SECONDS_PER_DAY,
  ]
  const ticks = ticksInSeconds
    .map((seconds) => seconds / SECONDS_PER_DAY)
    .filter((days) => days >= minDays && days <= maxDays)

  return ticks.length >= 2 ? ticks : undefined
}

function getFractionTicks(maxCensorFraction: number) {
  const tickCount = 5
  return Array.from(
    { length: tickCount + 1 },
    (_, i) => (maxCensorFraction * i) / tickCount,
  )
}

function formatCensoringFraction(value: number) {
  return `${(value * 100).toLocaleString('en-US', {
    maximumFractionDigits: 1,
  })}%`
}

function formatDelayDays(days: number) {
  if (days <= 0) return '0s'
  const seconds = Math.round(days * SECONDS_PER_DAY)
  if (seconds === 0) return '<1s'

  return formatSeconds(seconds)
}

function formatTooltipDelay(value: unknown) {
  if (value === null || value === undefined) return 'no inclusion'

  const days = Number(value)
  if (!Number.isFinite(days)) return 'no inclusion'

  return formatDelayDays(days)
}
