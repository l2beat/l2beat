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
  ChartTooltip,
  ChartTooltipWrapper,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'

import {
  getInclusionDelayChartData,
  getInclusionDelayEntityLegendEntries,
  type InclusionDelayEntityLegendEntry,
} from './calculateInclusionDelay'

interface Props {
  chart: ProjectInclusionDelayChart
  projectName: string
}

type YAxisScale = 'linear' | 'log'

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
  const entityMarkers = entityLegendEntries.filter(hasFiniteDelay)
  const yDomain = getYDomain(data, yAxisScale)

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
        entityStake: {
          label: 'Largest staking entities',
          color: 'var(--chart-cyan)',
          indicatorType: { shape: 'square' },
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
          <ChartLegend content={<ChartLegendContent />} />
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
                ? getLogDelayTicks(yDomain[0], yDomain[1])
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
              fill={chartMeta.entityStake?.color}
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
          <ChartTooltip
            filterNull={false}
            content={<InclusionDelayTooltip />}
          />
        </ComposedChart>
      </ChartContainer>
      <EntityMarkersLegend
        entries={entityLegendEntries}
        color={chartMeta.entityStake?.color}
      />
    </div>
  )
}

function EntityMarkersLegend({
  entries,
  color,
}: {
  entries: InclusionDelayEntityLegendEntry[]
  color: string | undefined
}) {
  if (entries.length === 0) return null

  return (
    <div className="mt-3 flex flex-col gap-2 font-medium text-label-value-13">
      <div className="flex items-center gap-1.5 text-secondary">
        <ChartDataIndicator
          type={{ shape: 'square' }}
          backgroundColor={color}
        />
        <span>Largest staking entities</span>
      </div>
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
    </div>
  )
}

function InclusionDelayTooltip({
  payload,
  label: censoringFraction,
}: CustomChartTooltipProps) {
  const { meta } = useChart()
  if (!payload || typeof censoringFraction !== 'number') return null

  return (
    <ChartTooltipWrapper>
      <div className="flex w-64 flex-col">
        <div className="mb-1 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          Censorship fraction: {formatCensoringFraction(censoringFraction)}
        </div>
        <HorizontalSeparator className="mb-2" />
        <div className="flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.name === undefined || entry.type === 'none') return null

            const config = meta[String(entry.name)]
            if (!config) return null

            return (
              <div
                key={entry.name}
                className="flex w-full items-center justify-between gap-2"
              >
                <div className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="font-medium text-label-value-14">
                    {config.label}
                  </span>
                </div>
                <span className="whitespace-nowrap font-medium text-label-value-15 tabular-nums">
                  {entry.value === null || entry.value === undefined
                    ? 'No finite delay'
                    : formatDelayDays(Number(entry.value))}
                </span>
              </div>
            )
          })}
        </div>
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
): [number, number] {
  const values = data.flatMap((point) =>
    [point.projectDelayDays, point.ethereumDelayDays].filter(
      (value): value is number => value !== null && value > 0,
    ),
  )

  if (values.length === 0) return [0, 1]

  const min = Math.min(...values)
  const max = Math.max(...values)

  if (scale === 'log') {
    return [min * 0.8, max === min ? max * 1.2 : max * 1.15]
  }

  return [0, max === 0 ? 1 : max * 1.1]
}

function getLogDelayTicks(minDays: number, maxDays: number) {
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
    86_400,
    7 * 86_400,
    30 * 86_400,
    365 * 86_400,
  ]
  const ticks = ticksInSeconds
    .map((seconds) => seconds / 86_400)
    .filter((days) => days >= minDays && days <= maxDays)

  return ticks.length >= 2 ? ticks : [minDays, maxDays]
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
  const seconds = Math.round(days * 86_400)
  if (seconds <= 0) return '<1s'

  return formatSeconds(seconds)
}

function formatEntityMarkerName(entry: InclusionDelayEntityLegendEntry) {
  const name = entry.entityNames.at(-1)
  if (!name) return ''
  if (entry.entityCount === 1) return name

  return `+ ${name}`
}

function formatTarget(target: number) {
  return `T${(target * 100).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`
}
