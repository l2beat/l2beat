import { formatSeconds } from '@l2beat/shared-pure'
import { useMemo, useState } from 'react'
import {
  CartesianGrid,
  ComposedChart,
  DefaultZIndexes,
  Line,
  XAxis,
  YAxis,
} from 'recharts'
import type {
  ChartMeta,
  CustomChartTooltipProps,
} from '~/components/core/chart/Chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipWrapper,
} from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { InclusionDelayYAxisScale } from '~/components/projects/sections/sequencing/InclusionDelayChart'
import type { ScalingDecentralizedSequencingEntry } from '~/server/features/scaling/decentralized-sequencing/getScalingDecentralizedSequencingEntries'
import { SECONDS_PER_DAY } from '~/utils/project/technology/inclusion-delay/shared'

interface Props {
  entries: ScalingDecentralizedSequencingEntry[]
}

type ChartEntry = ScalingDecentralizedSequencingEntry & {
  inclusionDelay: NonNullable<
    ScalingDecentralizedSequencingEntry['inclusionDelay']
  >
}

type ComparisonChartDataPoint = {
  timestamp: number
  censoringFraction: number
  [key: string]: number | null
}

const PROJECT_COLORS: Record<string, string> = {
  aztecnetwork: 'var(--chart-pink)',
  'polygon-pos': 'var(--chart-cyan)',
  gnosis: 'var(--chart-yellow)',
}

const ETHEREUM_DATA_KEY = 'ethereumDelayDays'

const FALLBACK_COLORS = [
  'var(--chart-fuchsia)',
  'var(--chart-sky)',
  'var(--chart-lime)',
  'var(--chart-orange)',
]

export function InclusionDelayComparisonChart({ entries }: Props) {
  const [yAxisScale, setYAxisScale] =
    useState<InclusionDelayYAxisScale>('linear')

  const chartEntries = useMemo(
    () =>
      entries.filter(
        (entry): entry is ChartEntry => entry.inclusionDelay !== undefined,
      ),
    [entries],
  )

  const chartMeta = useMemo<ChartMeta>(() => {
    return {
      ...Object.fromEntries(
        chartEntries.map((entry, index) => [
          entry.slug,
          {
            label: entry.name,
            color: getProjectColor(entry.slug, index),
            indicatorType: { shape: 'line' as const },
          },
        ]),
      ),
      [ETHEREUM_DATA_KEY]: {
        label: 'Ethereum',
        color: 'var(--chart-ethereum)',
        indicatorType: { shape: 'line', strokeDasharray: '3 3' },
      },
    }
  }, [chartEntries])

  const { showAllSelected, dataKeys, toggleDataKey, toggleAllDataKeys } =
    useChartDataKeys(chartMeta)

  const chartData = useMemo(
    () => getComparisonChartData(chartEntries),
    [chartEntries],
  )

  const maxCensorFraction = Math.max(
    ...chartEntries.map((entry) => entry.inclusionDelay.maxCensorFraction),
    0,
  )
  const yDomain = getYDomain(chartData, dataKeys, yAxisScale)

  if (chartEntries.length === 0) {
    return null
  }

  return (
    <section className="mt-6 px-4 md:px-0">
      <PrimaryCard className="rounded-lg md:rounded-lg">
        <ChartControlsWrapper>
          <div className="flex min-w-0 flex-col">
            <h2 className="font-bold text-heading-16 md:text-heading-20">
              Inclusion delay by censorship fraction
            </h2>
            <p className="text-paragraph-13 text-secondary md:text-paragraph-14">
              T99 inclusion delay in a static sequencer set by censoring
              fraction of sequencers/validators
            </p>
          </div>
          <RadioGroup
            name="decentralized-sequencing-inclusion-delay-y-axis"
            value={yAxisScale}
            onValueChange={(value) =>
              setYAxisScale(value as InclusionDelayYAxisScale)
            }
          >
            <RadioGroupItem value="linear">LIN</RadioGroupItem>
            <RadioGroupItem value="log">LOG</RadioGroupItem>
          </RadioGroup>
        </ChartControlsWrapper>
        <div className="mt-4">
          <ChartContainer
            data={chartData}
            meta={chartMeta}
            isLoading={false}
            interactiveLegend={{
              dataKeys,
              onItemClick: toggleDataKey,
            }}
          >
            <ComposedChart
              responsive
              data={chartData}
              margin={{ top: 20, right: 8, left: 0, bottom: 4 }}
            >
              <ChartLegendToggleAll
                showAllSelected={showAllSelected}
                onToggleAll={toggleAllDataKeys}
              />
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
              {chartEntries.map((entry) => (
                <Line
                  key={entry.slug}
                  dataKey={entry.slug}
                  type="monotone"
                  stroke={chartMeta[entry.slug]?.color}
                  strokeWidth={2}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                  hide={!dataKeys.includes(entry.slug)}
                />
              ))}
              <Line
                dataKey={ETHEREUM_DATA_KEY}
                type="monotone"
                stroke={chartMeta[ETHEREUM_DATA_KEY]?.color}
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
                isAnimationActive={false}
                hide={!dataKeys.includes(ETHEREUM_DATA_KEY)}
              />
              <ChartTooltip
                filterNull={false}
                content={<InclusionDelayComparisonTooltip meta={chartMeta} />}
              />
            </ComposedChart>
          </ChartContainer>
        </div>
      </PrimaryCard>
    </section>
  )
}

function getComparisonChartData(
  entries: ChartEntry[],
): ComparisonChartDataPoint[] {
  const points = new Map<number, ComparisonChartDataPoint>()

  for (const entry of entries) {
    for (const point of entry.inclusionDelay.chartData) {
      const existing = points.get(point.censoringFraction) ?? {
        timestamp: point.censoringFraction,
        censoringFraction: point.censoringFraction,
      }
      existing[entry.slug] = point.projectDelayDays
      existing[ETHEREUM_DATA_KEY] ??= point.ethereumDelayDays
      points.set(point.censoringFraction, existing)
    }
  }

  return [...points.values()]
    .sort((a, b) => a.censoringFraction - b.censoringFraction)
    .map((point) => {
      for (const entry of entries) {
        point[entry.slug] ??= null
      }
      point[ETHEREUM_DATA_KEY] ??= null
      return point
    })
}

function InclusionDelayComparisonTooltip({
  payload,
  label: censoringFraction,
  meta,
}: CustomChartTooltipProps & { meta: ChartMeta }) {
  if (!payload || typeof censoringFraction !== 'number') return null

  const rows = payload.filter(
    (entry) => typeof entry.dataKey === 'string' && meta[entry.dataKey],
  )

  return (
    <ChartTooltipWrapper>
      <div className="flex w-64 flex-col gap-2 font-medium text-label-value-14">
        <div>
          {formatCensoringFraction(censoringFraction)} censoring incurs an
          inclusion delay of
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((entry) => {
            const dataKey = `${entry.dataKey}`
            const item = meta[dataKey]
            if (!item) return null

            return (
              <div
                key={dataKey}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: item.color }}
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

function getYDomain(
  data: ComparisonChartDataPoint[],
  dataKeys: string[],
  scale: InclusionDelayYAxisScale,
): [number, number] {
  const values = data
    .flatMap((point) => dataKeys.map((key) => point[key]))
    .filter((value): value is number => typeof value === 'number' && value > 0)

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

function getProjectColor(slug: string, index: number) {
  return (
    PROJECT_COLORS[slug] ??
    FALLBACK_COLORS[index % FALLBACK_COLORS.length] ??
    'var(--chart-pink)'
  )
}
