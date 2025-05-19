'use client'

import {
  type TrackedTxsConfigSubtype,
  assertUnreachable,
} from '@l2beat/shared-pure'
import type { TooltipProps } from 'recharts'
import { Area, AreaChart, ReferenceArea } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/chart'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/pink-gradient-def'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { formatTimestamp } from '~/utils/dates'

export type ActivityChartType = 'Rollups' | 'ValidiumsAndOptimiums' | 'Others'

interface LivenessChartDataPoint {
  timestamp: number
  range: (number | null)[]
  avg: number | null
}

interface Props {
  data: LivenessChartDataPoint[] | undefined
  isLoading: boolean
  className?: string
  subtype: TrackedTxsConfigSubtype
}

export function LivenessChart({ data, isLoading, className, subtype }: Props) {
  const chartMeta = {
    range: {
      label: 'Min&max submission interval',
      color: 'hsl(var(--chart-pink-stroke-gradient-1))',
      indicatorType: {
        shape: 'line',
      },
    },
    avg: {
      label: 'Average interval',
      color: 'hsl(var(--chart-pink))',
      indicatorType: { shape: 'line', strokeDasharray: '3 3' },
    },
  } satisfies ChartMeta

  const lastValidTimestamp = data?.findLast((d) => d.avg !== null)?.timestamp
  const lastTimestamp = data?.at(-1)?.timestamp

  return (
    <ChartContainer
      data={data}
      className={className}
      meta={chartMeta}
      isLoading={isLoading}
    >
      <AreaChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="range"
          isAnimationActive={false}
          stroke="url(#strokeRange)"
          strokeWidth={2}
          fill="hsl(var(--chart-pink-fill-gradient))"
          fillOpacity={0.4}
          connectNulls
        />
        <Area
          dataKey="avg"
          isAnimationActive={false}
          strokeWidth={2}
          stroke="hsl(var(--chart-pink))"
          fill="none"
          strokeDasharray="5 5"
          connectNulls
        />
        {getCommonChartComponents({
          data,
          isLoading,
          yAxis: {
            tick: {
              width: 100,
            },
            tickFormatter: (value: number) => formatDuration(value),
            domain: ['auto', 'auto'],
          },
        })}
        <ReferenceArea
          x1={lastValidTimestamp}
          x2={lastTimestamp}
          fill="hsl(var(--negative))"
          fillOpacity={0.2}
        />
        <ChartTooltip content={<LivenessCustomTooltip subtype={subtype} />} />
        <defs>
          <PinkFillGradientDef id="fillRange" />
          <PinkStrokeGradientDef id="strokeRange" />
        </defs>
      </AreaChart>
    </ChartContainer>
  )
}

export function LivenessCustomTooltip({
  active,
  payload,
  label: timestamp,
  subtype,
}: TooltipProps<number, string> & {
  subtype: TrackedTxsConfigSubtype
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
      <div className="label-value-16-medium mt-2">
        {getTooltipContent(subtype)}
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
        <div className="label-value-14-medium mb-1 whitespace-nowrap text-secondary">
          {formatTimestamp(timestamp, {
            longMonthName: true,
            mode: 'datetime',
          })}
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
      <span className="label-value-14-medium">{name}</span>
      <span className="heading-16">{formatDuration(seconds)}</span>
    </div>
  )
}

function formatDuration(durationInSeconds: number) {
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
