import type { Milestone } from '@l2beat/config'
import {
  assert,
  assertUnreachable,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import {
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
} from 'recharts'
import type { ChartMeta, ChartProject } from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { NoDataPatternDef } from '~/components/core/chart/defs/NoDataPatternDef'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/PinkGradientDef'
import { getCommonChartComponents } from '~/components/core/chart/utils/getCommonChartComponents'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import type { LivenessChartResolution } from '~/server/features/scaling/liveness/utils/chartRange'
import { formatRange } from '~/utils/dates'

interface LivenessChartDataPoint {
  timestamp: number
  range: readonly [number | null, number | null] | null
  avg: number | null
}

interface Props {
  data: LivenessChartDataPoint[] | undefined
  isLoading: boolean
  project?: ChartProject
  className?: string
  subtype: TrackedTxsConfigSubtype
  milestones: Milestone[]
  tickCount?: number
  lastValidTimestamp: number | undefined
  anyAnomalyLive: boolean
  resolution: LivenessChartResolution
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

export function LivenessChart({
  data,
  isLoading,
  project,
  className,
  subtype,
  milestones,
  tickCount,
  lastValidTimestamp,
  anyAnomalyLive,
  resolution,
}: Props) {
  const noPostedAreas = useMemo(() => getNoPostedAreas(data), [data])
  console.log(noPostedAreas)
  const maxNoPostedAreaEnd = useMemo(
    () => Math.max(...noPostedAreas.map((area) => area.end.timestamp)),
    [noPostedAreas],
  )
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

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
      milestones={milestones}
      project={project}
    >
      <AreaChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        {noPostedAreas.map(({ start, end }) => [
          <ReferenceLine
            key={`${start.timestamp}-${end.timestamp}-bottom-line`}
            segment={[
              { x: start.timestamp, y: start.range?.[0] ?? 0 },
              { x: end.timestamp, y: end.range?.[0] ?? 0 },
            ]}
            stroke="var(--secondary)"
            strokeDasharray="5 5"
            opacity={0.25}
            strokeWidth={2}
          />,
          <ReferenceLine
            key={`${start.timestamp}-${end.timestamp}-top-line`}
            segment={[
              { x: start.timestamp, y: start.range?.[1] ?? 0 },
              { x: end.timestamp, y: end.range?.[1] ?? 0 },
            ]}
            stroke="var(--secondary)"
            strokeDasharray="5 5"
            opacity={0.25}
            strokeWidth={2}
          />,
          <ReferenceLine
            key={`${start.timestamp}-${end.timestamp}-avg-line`}
            segment={[
              { x: start.timestamp, y: start.avg ?? 0 },
              { x: end.timestamp, y: end.avg ?? 0 },
            ]}
            stroke="var(--secondary)"
            strokeDasharray="5 5"
            opacity={0.25}
            strokeWidth={2}
          />,
        ])}

        {singleDataPoints?.map((point) => [
          <ReferenceDot
            key={`${point.timestamp}-bottom-range`}
            x={point.timestamp}
            y={point.range?.[0] ?? 0}
            fill={chartMeta.range.color}
            stroke={chartMeta.range.color}
            r={3}
          />,
          <ReferenceDot
            key={`${point.timestamp}-top-range`}
            x={point.timestamp}
            y={point.range?.[1] ?? 0}
            fill={chartMeta.range.color}
            stroke={chartMeta.range.color}
            r={3}
          />,
          <ReferenceDot
            key={`${point.timestamp}-avg`}
            x={point.timestamp}
            y={point.avg ?? 0}
            fill={chartMeta.avg.color}
            fillOpacity={0.25}
            stroke={chartMeta.avg.color}
            strokeDasharray="1 1"
            r={3}
          />,
        ])}
        <Area
          dataKey="range"
          isAnimationActive={false}
          stroke="url(#strokeRange)"
          strokeWidth={2}
          fill="var(--chart-pink-fill-gradient)"
          fillOpacity={0.4}
        />
        <Area
          dataKey="avg"
          isAnimationActive={false}
          strokeWidth={2}
          stroke="var(--chart-pink)"
          fill="none"
          strokeDasharray="5 5"
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tickFormatter: (value: number) => formatDuration(value),
            domain: ['auto', 'auto'],
            tickCount,
          },
          // We want to show custom ReferenceArea for this chart
          syncedUntil: undefined,
        })}
        {lastValidTimestamp && (
          <ReferenceArea
            x1={lastValidTimestamp}
            fill={anyAnomalyLive ? 'var(--negative)' : 'url(#noDataFill)'}
            fillOpacity={anyAnomalyLive ? 0.2 : undefined}
          />
        )}

        <ChartTooltip
          filterNull={false}
          content={
            <LivenessCustomTooltip
              subtype={subtype}
              anyAnomalyLive={anyAnomalyLive}
              resolution={resolution}
              maxNoPostedAreaEnd={maxNoPostedAreaEnd}
            />
          }
        />
        <defs>
          <PinkFillGradientDef id="fillRange" />
          <PinkStrokeGradientDef id="strokeRange" />
          <NoDataPatternDef />
          <pattern
            id="noDataLiveness"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            patternTransform="rotate(45)"
          >
            <rect
              width="10"
              height="20"
              fill="var(--chart-pink)"
              fillOpacity={0.25}
            />
          </pattern>
        </defs>
      </AreaChart>
    </ChartContainer>
  )
}

function LivenessCustomTooltip({
  active,
  payload,
  label: timestamp,
  subtype,
  anyAnomalyLive,
  resolution,
  maxNoPostedAreaEnd,
}: TooltipProps<number, string> & {
  subtype: TrackedTxsConfigSubtype
  anyAnomalyLive: boolean
  resolution: LivenessChartResolution
  maxNoPostedAreaEnd: number
}) {
  if (!active || !payload || typeof timestamp !== 'number') return null

  const filteredPayload = payload.filter(
    (p) => p.name !== undefined && p.value !== undefined && p.type !== 'none',
  )
  const range = filteredPayload.find((p) => p.name === 'range')
  const avg = filteredPayload.find((p) => p.name === 'avg')

  let content: React.ReactNode = null
  if (!range?.value || !avg?.value) {
    content = (
      <div className="mt-2 font-medium text-label-value-16">
        {anyAnomalyLive || timestamp <= maxNoPostedAreaEnd
          ? getTooltipContent(subtype)
          : 'No data'}
      </div>
    )
  } else {
    const [min, max] = range.value as unknown as [number, number]
    content = (
      <div className="mt-2 flex flex-col gap-2">
        <Stat name="Minimum" seconds={min} />
        <Stat name="Average" seconds={avg.value} />
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
            timestamp +
              (resolution === 'hourly'
                ? UnixTime.HOUR
                : resolution === 'sixHourly'
                  ? UnixTime.SIX_HOURS
                  : UnixTime.DAY),
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
    <div className="flex items-center justify-between">
      <span className="font-medium text-label-value-14">{name}</span>
      <span className="text-heading-16">{formatDuration(seconds)}</span>
    </div>
  )
}

export function formatDuration(durationInSeconds: number) {
  const seconds = durationInSeconds
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const remainingSeconds = seconds - minutes * 60
  const remainingMinutes = minutes - hours * 60
  const remainingHours = hours - days * 24

  return days > 1
    ? `${days}d ${getDurationText(remainingHours, 'h')} ${getDurationText(remainingMinutes, 'm')}`
    : hours > 0
      ? `${hours}h ${getDurationText(remainingMinutes, 'm')} ${getDurationText(remainingSeconds, 's')}`
      : minutes > 0
        ? `${minutes}min ${getDurationText(remainingSeconds, 's')}`
        : `${seconds}s`
}

function getDurationText(amount: number, unit: 'd' | 'h' | 'm' | 's') {
  return amount > 0 ? `${amount}${unit}` : ''
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

function getNoPostedAreas(data: LivenessChartDataPoint[] | undefined) {
  const noPostedAreas: {
    start: LivenessChartDataPoint
    end: LivenessChartDataPoint
  }[] = []

  let i = 0
  let start: LivenessChartDataPoint | undefined
  while (i < (data?.length ?? 0)) {
    const point = data?.at(i)
    const nextPoint = data?.at(i + 1)
    assert(point, 'Point is defined')
    if (start !== undefined && point.range !== null && point.avg !== null) {
      noPostedAreas.push({ start, end: point })
      start = undefined
    }
    if (
      start === undefined &&
      nextPoint?.range === null &&
      nextPoint?.avg === null
    ) {
      start = point
    }

    i++
  }

  return noPostedAreas
}
