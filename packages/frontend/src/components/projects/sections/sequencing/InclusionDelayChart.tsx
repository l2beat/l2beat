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
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'

import {
  calculateProjectDelayDays,
  getInclusionDelayChartData,
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
  const marker = useMemo(() => getConfiguredMarker(chart), [chart])
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
      }) satisfies ChartMeta,
    [projectName],
  )

  return (
    <div className="my-6">
      <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-bold text-base md:text-lg">
            Inclusion delay by censorship fraction
          </div>
          <div className="text-secondary text-xs md:text-sm">
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
          {marker && (
            <ReferenceDot
              x={marker.censoringFraction}
              y={marker.delayDays}
              r={4}
              fill={chartMeta.projectDelayDays?.color}
              stroke="var(--background)"
              strokeWidth={2}
            />
          )}
          <ChartTooltip
            filterNull={false}
            content={<InclusionDelayTooltip />}
          />
        </ComposedChart>
      </ChartContainer>
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
        <div className="mb-3 whitespace-nowrap font-medium text-label-value-14 text-secondary">
          Censorship fraction: {formatCensoringFraction(censoringFraction)}
        </div>
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

function getConfiguredMarker(chart: ProjectInclusionDelayChart) {
  if (chart.configuredCensoringFraction === undefined) return undefined

  const censorCount = Math.round(
    chart.validatorCount * chart.configuredCensoringFraction,
  )
  const delayDays = calculateProjectDelayDays(chart, censorCount)
  if (delayDays === null) return undefined

  return {
    censoringFraction: censorCount / chart.validatorCount,
    delayDays,
  }
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

function formatTarget(target: number) {
  return `T${(target * 100).toLocaleString('en-US', {
    maximumFractionDigits: 2,
  })}`
}
