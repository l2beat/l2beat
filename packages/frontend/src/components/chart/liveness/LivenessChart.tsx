import type { Milestone } from '@l2beat/config'
import {
  assertUnreachable,
  type TrackedTxsConfigSubtype,
  UnixTime,
} from '@l2beat/shared-pure'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import {
  Area,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceDot,
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
  range: readonly [number, number] | null
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
      <ComposedChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="range"
          isAnimationActive={false}
          stroke="var(--secondary)"
          legendType="none"
          strokeWidth={2}
          strokeOpacity={0.15}
          fill="none"
          connectNulls
        />
        <Line
          dataKey="avg"
          legendType="none"
          isAnimationActive={false}
          stroke="var(--secondary)"
          strokeWidth={2}
          strokeOpacity={0.15}
          strokeDasharray="5 5"
          dot={false}
          connectNulls
        />
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
              lastValidTimestamp={lastValidTimestamp}
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
      </ComposedChart>
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
  lastValidTimestamp,
}: TooltipProps<number, string> & {
  subtype: TrackedTxsConfigSubtype
  anyAnomalyLive: boolean
  resolution: LivenessChartResolution
  lastValidTimestamp: number | undefined
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
        {anyAnomalyLive ||
        (lastValidTimestamp && timestamp <= lastValidTimestamp)
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
    <div className="flex items-center justify-between gap-1.5">
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
