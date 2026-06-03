import { formatSeconds } from '@l2beat/shared-pure'
import type { ReactElement, ReactNode } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  DefaultZIndexes,
  Line,
  ReferenceDot,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartLegendItemLabel,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import type {
  InclusionDelayEntityMarker,
  InclusionDelayThresholdMarker,
} from '~/utils/project/technology/inclusion-delay/calculateInclusionDelay'
import { SECONDS_PER_DAY } from '~/utils/project/technology/inclusion-delay/shared'

export type InclusionDelayYAxisScale = 'linear' | 'log'

export type InclusionDelayChartDataPoint = {
  timestamp: number
  censoringFraction: number
  [key: string]: number | null
}

const INCLUSION_DELAY_ENTITY_MARKER_COLOR = 'var(--chart-cyan)'
const DELAY_THRESHOLD_COLOR = 'var(--chart-yellow)'

interface Props {
  data: InclusionDelayChartDataPoint[]
  chartMeta: ChartMeta
  maxCensorFraction: number
  yAxisScale: InclusionDelayYAxisScale
  thresholdMarkers?: InclusionDelayThresholdMarker[]
  entityMarkers?: InclusionDelayEntityMarker[]
  interactiveLegend?: {
    dataKeys: string[]
    onItemClick: (dataKey: string) => void
    disableOnboarding?: boolean
  }
  legend?: ReactNode
  tooltipContent?: ReactElement
}

export function InclusionDelayChart({
  data,
  chartMeta,
  maxCensorFraction,
  yAxisScale,
  thresholdMarkers = [],
  entityMarkers = [],
  interactiveLegend,
  legend,
  tooltipContent,
}: Props) {
  const dataKeys = Object.keys(chartMeta)
  const visibleDataKeys = interactiveLegend?.dataKeys ?? dataKeys
  const yDomain = getInclusionDelayYDomain(
    data,
    visibleDataKeys,
    yAxisScale,
    thresholdMarkers,
  )

  return (
    <ChartContainer
      data={data}
      meta={chartMeta}
      isLoading={false}
      interactiveLegend={interactiveLegend}
    >
      <ComposedChart
        responsive
        data={data}
        margin={{ top: 20, right: 8, left: 0, bottom: 4 }}
      >
        {legend ?? (
          <ChartLegend
            content={
              <ChartLegendContent>
                {entityMarkers.length > 0 && (
                  <div className="order-last flex shrink-0 items-center gap-[3px] pl-2">
                    <ChartDataIndicator
                      type={{ shape: 'square' }}
                      backgroundColor={INCLUSION_DELAY_ENTITY_MARKER_COLOR}
                    />
                    <ChartLegendItemLabel>
                      Largest staking entities
                    </ChartLegendItemLabel>
                  </div>
                )}
              </ChartLegendContent>
            }
          />
        )}
        <CartesianGrid
          vertical={false}
          syncWithTicks
          zIndex={DefaultZIndexes.line + 1}
        />
        <XAxis
          type="number"
          dataKey="censoringFraction"
          domain={[0, maxCensorFraction]}
          ticks={getFractionTicks(maxCensorFraction)}
          tickFormatter={formatCensoringFraction}
          tickLine={false}
          axisLine={false}
          minTickGap={16}
        />
        <YAxis
          scale={yAxisScale === 'log' ? 'log' : 'linear'}
          domain={yDomain}
          ticks={
            yAxisScale === 'log'
              ? (getLogDelayTicks(yDomain[0], yDomain[1]) ?? undefined)
              : undefined
          }
          tickFormatter={(value) => formatDelayDays(Number(value))}
          tickLine={false}
          axisLine={false}
          mirror
          tickCount={yAxisScale === 'linear' ? 4 : undefined}
          dy={-10}
          tick={{ width: 350 }}
          allowDataOverflow={yAxisScale === 'log'}
        />
        {dataKeys.map((dataKey) => {
          const meta = chartMeta[dataKey]
          if (!meta || meta.indicatorType.shape !== 'line') {
            return null
          }

          return (
            <Line
              key={dataKey}
              dataKey={dataKey}
              type="monotone"
              stroke={meta.color}
              strokeWidth={2}
              strokeDasharray={
                meta.indicatorType.strokeDasharray ? '5 5' : undefined
              }
              dot={false}
              connectNulls
              isAnimationActive={false}
              hide={
                interactiveLegend &&
                !interactiveLegend.dataKeys.includes(dataKey)
              }
            />
          )
        })}
        {entityMarkers.map((marker) => (
          <ReferenceDot
            key={marker.id}
            x={marker.stakeFraction}
            y={marker.delayDays}
            r={4.5}
            fill={INCLUSION_DELAY_ENTITY_MARKER_COLOR}
            stroke="var(--background)"
            strokeWidth={2}
            label={{
              value: marker.label,
              position: 'top',
              fill: 'var(--primary)',
              fontSize: 11,
              fontWeight: 500,
              offset: 8,
            }}
            ifOverflow="discard"
          />
        ))}
        {thresholdMarkers.map((marker) => (
          <ReferenceDot
            key={marker.id}
            x={marker.censoringFraction}
            y={marker.delayDays}
            r={5.5}
            fill="transparent"
            stroke={DELAY_THRESHOLD_COLOR}
            strokeWidth={2.5}
            label={{
              value: marker.label,
              position: 'bottom',
              fill: DELAY_THRESHOLD_COLOR,
              fontSize: 11,
              fontWeight: 500,
              offset: 8,
            }}
            ifOverflow="discard"
          />
        ))}
        <ChartTooltip
          filterNull={false}
          content={tooltipContent ?? <InclusionDelayTooltip />}
        />
      </ComposedChart>
    </ChartContainer>
  )
}

function InclusionDelayTooltip({
  payload,
  label: censoringFraction,
}: CustomChartTooltipProps) {
  if (!payload || typeof censoringFraction !== 'number') return null
  const projectDelay = payload.find(
    (entry) => entry.dataKey === 'projectDelayDays',
  )?.value
  const ethereumDelay = payload.find(
    (entry) => entry.dataKey === 'ethereumDelayDays',
  )?.value

  return (
    <ChartTooltipWrapper>
      <div className="w-64 font-medium text-label-value-14">
        {formatCensoringFraction(censoringFraction)} censoring lead to{' '}
        {formatTooltipDelay(projectDelay, {
          suffix: 'inclusion delay',
          fallback: 'no finite inclusion delay',
        })}{' '}
        (
        {formatTooltipDelay(ethereumDelay, {
          suffix: 'on Ethereum for comparison',
          fallback: 'no finite delay on Ethereum for comparison',
        })}
        )
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

export function formatCensoringFraction(value: number) {
  return `${(value * 100).toLocaleString('en-US', {
    maximumFractionDigits: 1,
  })}%`
}

export function formatDelayDays(days: number) {
  if (days <= 0) return '0s'
  const seconds = Math.round(days * SECONDS_PER_DAY)
  if (seconds === 0) return '<1s'

  return formatSeconds(seconds)
}

function formatTooltipDelay(
  value: unknown,
  labels: { suffix: string; fallback: string },
) {
  if (value === null || value === undefined) return labels.fallback

  const days = Number(value)
  if (!Number.isFinite(days)) return labels.fallback

  return `${formatDelayDays(days)} ${labels.suffix}`
}
