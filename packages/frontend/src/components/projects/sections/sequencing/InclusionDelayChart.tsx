import type { ProjectInclusionDelayChart } from '@l2beat/config'
import { formatSeconds } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
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
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'

import {
  getInclusionDelayChartData,
  getInclusionDelayEntityLegendEntries,
  getInclusionDelayThresholdMarkers,
  type InclusionDelayEntityLegendEntry,
  type InclusionDelayThresholdMarker,
} from './calculateInclusionDelay'

interface Props {
  chart: ProjectInclusionDelayChart
  projectName: string
}

type YAxisScale = 'linear' | 'log'

const ENTITY_MARKER_COLOR = 'var(--chart-cyan)'
const DELAY_THRESHOLD_COLOR = 'var(--chart-yellow)'
const SECONDS_PER_DAY = 86_400

export function InclusionDelayChart({ chart, projectName }: Props) {
  const [yAxisScale, setYAxisScale] = useState<YAxisScale>('linear')
  const data = useMemo(
    () =>
      getInclusionDelayChartData(chart).map((point) => ({
        ...point,
        timestamp: point.censoringFraction,
      })),
    [chart],
  )
  const entityLegendEntries = useMemo(
    () => getInclusionDelayEntityLegendEntries(chart),
    [chart],
  )
  const thresholdMarkers = useMemo(
    () => getInclusionDelayThresholdMarkers(chart),
    [chart],
  )
  const entityMarkers = entityLegendEntries.filter(hasFiniteDelay)
  const yDomain = getYDomain(data, yAxisScale, thresholdMarkers)

  const chartMeta = useMemo(
    () =>
      ({
        projectDelayDays: {
          label: projectName,
          color: 'var(--chart-pink)',
          indicatorType: { shape: 'line' },
        },
        ethereumDelayDays: {
          label: 'Ethereum',
          color: 'var(--chart-ethereum)',
          indicatorType: { shape: 'line', strokeDasharray: '3 3' },
        },
      }) satisfies ChartMeta,
    [projectName],
  )

  return (
    <div className="my-6">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-bold text-heading-16 md:text-heading-18">
            Inclusion delay by censorship fraction
          </div>
          <div className="font-medium text-label-value-13 text-secondary md:text-label-value-14">
            {formatTarget(chart.target)} inclusion delay in a static sequencer
            set by censoring fraction of sequencers/validators
          </div>
        </div>
        <ChartControlsWrapper className="justify-start md:justify-end">
          <RadioGroup
            name={`${projectName}-inclusion-delay-y-axis`}
            value={yAxisScale}
            onValueChange={(value) => setYAxisScale(value as YAxisScale)}
          >
            <RadioGroupItem value="linear">LIN</RadioGroupItem>
            <RadioGroupItem value="log">LOG</RadioGroupItem>
          </RadioGroup>
        </ChartControlsWrapper>
      </div>
      <ChartContainer data={data} meta={chartMeta} isLoading={false}>
        <ComposedChart
          responsive
          data={data}
          margin={{ top: 20, right: 8, left: 0, bottom: 4 }}
        >
          <ChartLegend
            content={
              <ChartLegendContent>
                {chart.stakeDistribution !== undefined && (
                  <div className="order-last flex shrink-0 items-center gap-[3px] pl-2">
                    <ChartDataIndicator
                      type={{ shape: 'square' }}
                      backgroundColor={ENTITY_MARKER_COLOR}
                    />
                    <ChartLegendItemLabel>
                      Largest staking entities
                    </ChartLegendItemLabel>
                  </div>
                )}
              </ChartLegendContent>
            }
          />
          <CartesianGrid
            vertical={false}
            syncWithTicks
            zIndex={DefaultZIndexes.line + 1}
          />
          <XAxis
            type="number"
            dataKey="censoringFraction"
            domain={[0, chart.maxCensorFraction]}
            ticks={getFractionTicks(chart.maxCensorFraction)}
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
                ? getLogDelayTicks(yDomain[0], yDomain[1]) ?? undefined
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
          <Line
            dataKey="projectDelayDays"
            type="monotone"
            stroke={chartMeta.projectDelayDays?.color}
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            dataKey="ethereumDelayDays"
            type="monotone"
            stroke={chartMeta.ethereumDelayDays?.color}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          {entityMarkers.map((marker) => (
            <ReferenceDot
              key={marker.id}
              x={marker.stakeFraction}
              y={marker.delayDays}
              r={4.5}
              fill={ENTITY_MARKER_COLOR}
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
            content={<InclusionDelayTooltip />}
          />
        </ComposedChart>
      </ChartContainer>
      <EntityMarkersLegend
        entries={entityLegendEntries}
        hasStakeDistribution={chart.stakeDistribution !== undefined}
      />
    </div>
  )
}

function EntityMarkersLegend({
  entries,
  hasStakeDistribution,
}: {
  entries: InclusionDelayEntityLegendEntry[]
  hasStakeDistribution: boolean
}) {
  if (!hasStakeDistribution) return null

  return (
    <div className="mt-3 font-medium text-label-value-13">
      {entries.length > 0 ? (
        <div className="grid gap-x-6 gap-y-1.5 md:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="min-w-0 truncate"
              title={entry.entityNames.join(', ')}
            >
              <span className="text-primary">{entry.label}:</span>{' '}
              <span className="text-secondary">
                {formatEntityMarkerName(entry)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-fit rounded bg-warning/15 px-2 py-1 text-warning">
          No data about stake distribution among entities available
        </div>
      )}
    </div>
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

function hasFiniteDelay(
  entry: InclusionDelayEntityLegendEntry,
): entry is InclusionDelayEntityLegendEntry & { delayDays: number } {
  return entry.delayDays !== null
}

function getYDomain(
  data: { projectDelayDays: number | null; ethereumDelayDays: number | null }[],
  scale: YAxisScale,
  thresholdMarkers: InclusionDelayThresholdMarker[],
): [number, number] {
  const values = [
    ...data.flatMap((point) =>
      [point.projectDelayDays, point.ethereumDelayDays].filter(
        (value): value is number => value !== null && value > 0,
      ),
    ),
    ...thresholdMarkers.map((marker) => marker.delayDays),
  ].filter((value): value is number => value !== null && value > 0)

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

function formatTooltipDelay(
  value: unknown,
  labels: { suffix: string; fallback: string },
) {
  if (value === null || value === undefined) return labels.fallback

  const days = Number(value)
  if (!Number.isFinite(days)) return labels.fallback

  return `${formatDelayDays(days)} ${labels.suffix}`
}

function formatEntityMarkerName(entry: InclusionDelayEntityLegendEntry) {
  return entry.entityNames.at(-1) ?? ''
}

function formatTarget(target: number) {
  return `T${(target * 100).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`
}
