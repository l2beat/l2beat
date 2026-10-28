import type { Milestone } from '@l2beat/config'
import {
  assertUnreachable,
  formatSeconds,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import { NoDataPatternDef } from '~/components/core/chart/defs/NoDataPatternDef'
import { PinkStrokeGradientDef } from '~/components/core/chart/defs/PinkGradientDef'
import {
  type ChartReferenceDot,
  type ChartSeries,
  ChartTooltipWrapper,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { formatRange } from '~/utils/dates'
import type { ChartResolution } from '~/utils/range/range'

interface LivenessChartDataPoint {
  timestamp: number
  range: readonly [number, number] | null
  avg: number | null
}

interface Props {
  data: LivenessChartDataPoint[] | undefined
  isLoading: boolean
  project?: ChartProject
  subtype: TrackedTxsConfigSubtype
  milestones: Milestone[]
  tickCount?: number
  lastValidTimestamp: number | undefined
  anyAnomalyLive: boolean
  resolution: ChartResolution
}

const chartMeta = {
  range: {
    label: 'Min&max submission interval',
    color: 'var(--chart-pink-stroke-gradient-1)',
    indicatorType: {
      shape: 'line',
    },
  },
  avg: {
    label: 'Average interval',
    color: 'var(--chart-pink)',
    indicatorType: { shape: 'line', strokeDasharray: '3 3' },
  },
} satisfies ChartMeta

const getMin = (row: LivenessChartDataPoint) => row.range?.[0]
const getMax = (row: LivenessChartDataPoint) => row.range?.[1]

/**
 * Both edges of the range band are stroked and get an active dot, so the
 * band's bottom edge is a series of its own. The faint `bridge*`
 * series connect the real ones across gaps; they stay out of the legend and
 * the tooltip, which come from the meta and the row.
 */
const SERIES: ChartSeries<string, LivenessChartDataPoint>[] = [
  {
    key: 'bridgeMax',
    value: getMax,
    stroke: 'var(--secondary)',
    strokeOpacity: 0.15,
    connectNulls: true,
    activeDot: false,
  },
  {
    key: 'bridgeMin',
    value: getMin,
    stroke: 'var(--secondary)',
    strokeOpacity: 0.15,
    connectNulls: true,
    activeDot: false,
  },
  {
    key: 'range',
    value: getMax,
    value0: getMin,
    stroke: 'url(#strokeRange)',
    fill: 'var(--chart-pink-fill-gradient)',
    fillOpacity: 0.4,
  },
  {
    key: 'rangeMin',
    value: getMin,
    stroke: 'url(#strokeRange)',
  },
  {
    key: 'avg',
    stroke: 'var(--chart-pink)',
    strokeDasharray: '5 5',
  },
  {
    key: 'bridgeAvg',
    value: (row) => row.avg,
    stroke: 'var(--secondary)',
    strokeOpacity: 0.15,
    strokeDasharray: '5 5',
    connectNulls: true,
    activeDot: false,
  },
]

export function LivenessChart({
  data,
  isLoading,
  project,
  subtype,
  milestones,
  tickCount,
  lastValidTimestamp,
  anyAnomalyLive,
  resolution,
}: Props) {
  const singleDataPoints = useMemo(() => {
    return data?.filter((point, i, arr) => {
      const prevPoint = arr.at(i - 1)
      const nextPoint = arr.at(i + 1)

      return (
        prevPoint?.range === null &&
        nextPoint?.range === null &&
        point.range !== null
      )
    })
  }, [data])

  const referenceDots = useMemo(
    () =>
      (singleDataPoints ?? []).flatMap((point): ChartReferenceDot[] => [
        {
          x: point.timestamp,
          y: point.range?.[0] ?? 0,
          fill: chartMeta.range.color,
          stroke: chartMeta.range.color,
          r: 3,
        },
        {
          x: point.timestamp,
          y: point.range?.[1] ?? 0,
          fill: chartMeta.range.color,
          stroke: chartMeta.range.color,
          r: 3,
        },
        {
          x: point.timestamp,
          y: point.avg ?? 0,
          fill: chartMeta.avg.color,
          fillOpacity: 0.25,
          stroke: chartMeta.avg.color,
          r: 3,
        },
      ]),
    [singleDataPoints],
  )

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
      legend
    >
      <TimeSeriesChart
        data={data}
        series={SERIES}
        ariaLabel="Liveness"
        yAxis={{ format: formatSeconds, domain: 'auto', tickCount }}
        referenceDots={referenceDots}
        referenceAreas={
          lastValidTimestamp
            ? [
                {
                  x1: lastValidTimestamp,
                  fill: anyAnomalyLive ? 'var(--negative)' : 'url(#noDataFill)',
                  fillOpacity: anyAnomalyLive ? 0.2 : undefined,
                },
              ]
            : undefined
        }
        defs={
          <>
            <PinkStrokeGradientDef id="strokeRange" />
            <NoDataPatternDef />
          </>
        }
        renderTooltip={(row) => (
          <LivenessCustomTooltip
            row={row}
            subtype={subtype}
            anyAnomalyLive={anyAnomalyLive}
            resolution={resolution}
            lastValidTimestamp={lastValidTimestamp}
          />
        )}
      />
    </ChartContainer>
  )
}

function LivenessCustomTooltip({
  row,
  subtype,
  anyAnomalyLive,
  resolution,
  lastValidTimestamp,
}: {
  row: LivenessChartDataPoint
  subtype: TrackedTxsConfigSubtype
  anyAnomalyLive: boolean
  resolution: ChartResolution
  lastValidTimestamp: number | undefined
}) {
  const { timestamp, range, avg } = row

  let content: React.ReactNode = null
  if (!range || !avg) {
    content = (
      <div className="mt-2 font-medium text-label-value-16">
        {anyAnomalyLive ||
        (lastValidTimestamp && timestamp <= lastValidTimestamp)
          ? getTooltipContent(subtype)
          : 'No data'}
      </div>
    )
  } else {
    const [min, max] = range
    content = (
      <div className="mt-2 flex flex-col gap-2">
        <Stat name="Minimum" seconds={min} />
        <Stat name="Average" seconds={avg} />
        <Stat name="Maximum" seconds={max} />
      </div>
    )
  }
  return (
    <ChartTooltipWrapper>
      <div className="flex w-fit flex-col">
        <div className="mb-1 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          {formatRange(
            timestamp,
            timestamp + UnixTime.periodToSeconds(resolution),
          )}
        </div>
        <HorizontalSeparator className="mt-1.5" />
        {content}
      </div>
    </ChartTooltipWrapper>
  )
}

function Stat({ name, seconds }: { name: string; seconds: number }) {
  return (
    <div className="flex items-center justify-between gap-1.5">
      <span className="font-medium text-label-value-14">{name}</span>
      <span className="text-heading-16">{formatSeconds(seconds)}</span>
    </div>
  )
}

function getTooltipContent(subtype: TrackedTxsConfigSubtype) {
  switch (subtype) {
    case 'stateUpdates':
      return <div>No state updates</div>
    case 'batchSubmissions':
      return <div>No tx data submissions</div>
    case 'proofSubmissions':
      return <div>No proof submissions</div>
    default:
      assertUnreachable(subtype)
  }
}
