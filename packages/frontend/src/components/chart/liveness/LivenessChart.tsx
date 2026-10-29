import type { Milestone } from '@l2beat/config'
import {
  assertUnreachable,
  formatSeconds,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type {
  ChartMeta,
  ChartProject,
} from '~/components/core/chart/ChartContext'
import { ChartTooltipWrapper } from '~/components/core/chart/ChartTooltip'
import { CHART_GRADIENTS } from '~/components/core/chart/gradients'
import {
  type ChartSeries,
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

const GAP_STROKE = { stroke: 'var(--secondary)', strokeOpacity: 0.15 }

/**
 * The range is a band between the minimum and the maximum. Faint lines
 * bridge both series' gaps, and a lone point gets dots, as no line shows it.
 */
const SERIES: ChartSeries<string, LivenessChartDataPoint>[] = [
  {
    key: 'range',
    value: (row) => row.range?.[1],
    value0: (row) => row.range?.[0],
    stroke: CHART_GRADIENTS.pink.stroke,
    fill: 'var(--chart-pink-fill-gradient)',
    fillOpacity: 0.4,
    gapStroke: GAP_STROKE,
    isolatedDots: {},
  },
  {
    key: 'avg',
    stroke: 'var(--chart-pink)',
    strokeDasharray: '5 5',
    gapStroke: GAP_STROKE,
    isolatedDots: { fillOpacity: 0.25 },
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
        referenceAreas={
          lastValidTimestamp
            ? [
                {
                  x1: lastValidTimestamp,
                  ...(anyAnomalyLive
                    ? { fill: 'var(--negative)', fillOpacity: 0.2 }
                    : {}),
                },
              ]
            : undefined
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
