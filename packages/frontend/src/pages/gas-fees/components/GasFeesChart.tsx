import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Line, LineChart, ReferenceArea, ReferenceLine } from 'recharts'
import {
  ChartContainer,
  type ChartMeta,
  ChartTooltip,
  ChartTooltipWrapper,
  type CustomChartTooltipProps,
  useChart,
} from '~/components/core/chart/Chart'
import { ChartCommonComponents } from '~/components/core/chart/ChartCommonComponents'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartDataIndicator } from '~/components/core/chart/ChartDataIndicator'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import type { GasFeesChartData } from '~/server/features/gas-fees/getGasFeesChart'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  GAS_FEES_METRICS,
  type GasFeesMetric,
} from '~/server/features/gas-fees/types'
import { formatRange } from '~/utils/dates'
import type { ChartRange } from '~/utils/range/range'
import type { GasFeesScale } from './GasFeesView'
import {
  formatFee,
  formatFeeTick,
  formatTimes,
  GAS_FEES_METRIC_LABELS,
  GAS_FEES_RANGE_OPTIONS,
} from './metrics'
import type { GasFeesChain } from './types'

/** Ethereum and the four busiest L2s; the rest are one legend click away */
const DEFAULT_VISIBLE_CHAINS = [
  'ethereum',
  'base',
  'arbitrum',
  'unichain',
  'optimism',
]

const RANGE_LABELS: Record<(typeof GAS_FEES_RANGE_OPTIONS)[number], string> = {
  '7d': '7D',
  '30d': '30D',
  '90d': '90D',
  '1y': '1Y',
  max: 'Max',
}

interface Props {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  data: GasFeesChartData | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  /** The metric of the data on screen, which lags `metric` while it loads */
  shownMetric: GasFeesMetric
  range: ChartRange
  setRange: (range: ChartRange) => void
  metric: GasFeesMetric
  setMetric: (metric: GasFeesMetric) => void
  scale: GasFeesScale
  setScale: (scale: GasFeesScale) => void
  highlightedChainId: string | undefined
  markedUpgrade: GasFeesUpgrade | undefined
}

type Point = { timestamp: number } & Record<string, number | null>

export function GasFeesChart({
  chains,
  upgrades,
  data,
  isLoading,
  isPlaceholderData,
  shownMetric,
  range,
  setRange,
  metric,
  setMetric,
  scale,
  setScale,
  highlightedChainId,
  markedUpgrade,
}: Props) {
  const meta = useMemo<ChartMeta>(
    () =>
      Object.fromEntries(
        chains.map((chain) => [
          chain.id,
          {
            label: (
              <span className="inline-flex items-center gap-1">
                <img
                  src={chain.iconUrl}
                  alt=""
                  width={14}
                  height={14}
                  className="size-3.5 rounded-full"
                />
                {chain.shortName ?? chain.name}
              </span>
            ),
            legendLabel: chain.shortName ?? chain.name,
            color: chain.color,
            indicatorType: { shape: 'line' },
          },
        ]),
      ),
    [chains],
  )
  const hidden = useMemo(
    () =>
      chains
        .filter((c) => !DEFAULT_VISIBLE_CHAINS.includes(c.id))
        .map((c) => c.id),
    [chains],
  )
  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(meta, hidden)

  const points = useMemo<Point[] | undefined>(
    () =>
      data?.chart.map(([timestamp, ...values]) => {
        const point: Point = { timestamp }
        chains.forEach((chain, i) => {
          point[chain.id] = values[i] ?? null
        })
        return point
      }),
    [data, chains],
  )

  const yAxis = useMemo(
    () => getYAxis(points, dataKeys, scale),
    [points, dataKeys, scale],
  )
  const milestones = useMemo(() => toMilestones(upgrades), [upgrades])
  const mark = useMemo(
    () => getMarkedArea(points, markedUpgrade),
    [points, markedUpgrade],
  )
  const timeRange = useMemo(() => getChartTimeRangeFromData(points), [points])

  return (
    <div className="flex flex-col gap-3">
      <ChartControlsWrapper className="flex-wrap items-start">
        <div>
          <h2 className="font-bold text-xl">
            {GAS_FEES_METRIC_LABELS[shownMetric].title}
          </h2>
          <ChartTimeRange
            isPlaceholderData={isPlaceholderData}
            timeRange={timeRange}
          />
        </div>
        <ChartRangeControls
          name="gasFeesRange"
          value={range}
          setValue={setRange}
          options={GAS_FEES_RANGE_OPTIONS.map((value) => ({
            value,
            label: RANGE_LABELS[value],
          }))}
        />
      </ChartControlsWrapper>
      <div className="flex flex-wrap justify-between gap-2">
        <RadioGroup
          name="gasFeesMetric"
          value={metric}
          onValueChange={(value) => setMetric(value as GasFeesMetric)}
          className="max-w-full overflow-x-auto"
        >
          {GAS_FEES_METRICS.map((m) => (
            <RadioGroupItem key={m} value={m} className="whitespace-nowrap">
              {GAS_FEES_METRIC_LABELS[m].short}
            </RadioGroupItem>
          ))}
        </RadioGroup>
        <RadioGroup
          name="gasFeesScale"
          value={scale}
          onValueChange={(value) => setScale(value as GasFeesScale)}
        >
          <RadioGroupItem value="log">Log</RadioGroupItem>
          <RadioGroupItem value="lin">Lin</RadioGroupItem>
        </RadioGroup>
      </div>
      <ChartContainer
        data={points}
        meta={meta}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        milestones={milestones}
        interactiveLegend={{ dataKeys, onItemClick: toggleDataKey }}
        noDataSourceMessage="Select at least one chain"
        size="large"
      >
        {/* Without right:1 the last point is not hoverable */}
        <LineChart responsive data={points} margin={{ top: 20, right: 1 }}>
          <ChartLegendToggleAll
            showAllSelected={showAllSelected}
            onToggleAll={toggleAllDataKeys}
          />
          {mark && (
            <ReferenceArea
              x1={mark.from}
              x2={mark.to}
              fill="var(--brand)"
              fillOpacity={0.12}
              ifOverflow="hidden"
            />
          )}
          {mark && (
            <ReferenceLine
              x={mark.at}
              stroke="var(--brand)"
              strokeDasharray="3 3"
              label={{
                value: mark.label,
                position: 'insideTopLeft',
                fill: 'var(--brand)',
                fontSize: 12,
              }}
            />
          )}
          {chains.map((chain) => (
            <Line
              key={chain.id}
              dataKey={chain.id}
              hide={!dataKeys.includes(chain.id)}
              stroke={chain.color}
              strokeWidth={chain.id === 'ethereum' ? 2.5 : 1.75}
              strokeOpacity={
                highlightedChainId !== undefined &&
                highlightedChainId !== chain.id
                  ? 0.2
                  : 1
              }
              className="[&_.recharts-line-curve]:transition-[stroke-opacity] [&_.recharts-line-curve]:duration-200 motion-reduce:[&_.recharts-line-curve]:transition-none"
              dot={false}
              isAnimationActive={false}
            />
          ))}
          <ChartCommonComponents
            data={points}
            isLoading={isLoading}
            yAxis={yAxis}
            syncedUntil={undefined}
          />
          <ChartTooltip
            content={<GasFeesTooltip smoothed={data?.smoothed ?? false} />}
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

function getYAxis(
  points: Point[] | undefined,
  dataKeys: string[],
  scale: GasFeesScale,
) {
  if (scale === 'lin') {
    return { tickCount: 4, tickFormatter: (v: number) => formatFee(v) }
  }
  let min = Number.POSITIVE_INFINITY
  let max = 0
  for (const point of points ?? []) {
    for (const key of dataKeys) {
      const value = point[key]
      if (typeof value === 'number' && value > 0) {
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
    }
  }
  if (max === 0) return { tickCount: 4 }
  // Whole powers of ten, so every gridline is 10× the one below
  const lo = Math.floor(Math.log10(min))
  const hi = Math.ceil(Math.log10(max))
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i))
  return {
    scale: 'log' as const,
    domain: [10 ** lo, 10 ** hi],
    ticks,
    allowDataOverflow: true,
    tickFormatter: (v: number) => formatFeeTick(v),
  }
}

function toMilestones(upgrades: GasFeesUpgrade[]): Milestone[] {
  return upgrades.flatMap((u) =>
    u.timestamp === null || u.kind !== 'upgrade'
      ? []
      : [
          {
            type: 'general' as const,
            title: u.title,
            url: u.url,
            date: UnixTime.toDate(u.timestamp).toISOString(),
            description: u.summary,
          },
        ],
  )
}

/** The ±30 days the timeline compares, snapped to points on the chart */
function getMarkedArea(
  points: Point[] | undefined,
  upgrade: GasFeesUpgrade | undefined,
) {
  const at = upgrade?.timestamp
  if (!points?.length || !upgrade || at === null || at === undefined) return
  const window = 30 * UnixTime.DAY
  const inside = points.filter(
    (p) => p.timestamp >= at - window && p.timestamp < at + window,
  )
  const first = inside[0]
  const last = inside[inside.length - 1]
  const atPoint = points.find((p) => p.timestamp >= at)
  if (!first || !last || !atPoint) return
  return {
    from: first.timestamp,
    to: last.timestamp,
    at: atPoint.timestamp,
    label: upgrade.title,
  }
}

function GasFeesTooltip({
  payload,
  label,
  smoothed,
}: CustomChartTooltipProps & { smoothed: boolean }) {
  const { meta } = useChart()
  if (!payload || typeof label !== 'number') return null

  const visible = payload.filter(
    (entry) =>
      entry.type !== 'none' &&
      !entry.hide &&
      entry.value !== null &&
      entry.value !== undefined,
  )
  if (visible.length === 0) return null
  const ethereum = payload.find((e) => e.name === 'ethereum')?.value
  const sorted = [...visible].sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

  return (
    <ChartTooltipWrapper>
      <div className="flex w-72 flex-col">
        <div className="font-medium text-label-value-14 text-secondary">
          {/* A daily bucket, or the week a 7-day average covers */}
          {smoothed
            ? formatRange(label - 6 * UnixTime.DAY, label + UnixTime.DAY)
            : formatRange(label, label + UnixTime.DAY)}
          {smoothed && <span className="block text-2xs">7-day average</span>}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {sorted.map((entry) => {
            const config = entry.name ? meta[entry.name] : undefined
            if (!config || entry.value === undefined || entry.value === null)
              return null
            const times =
              entry.name !== 'ethereum' && typeof ethereum === 'number'
                ? ethereum / entry.value
                : undefined
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-3"
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
                <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                  {times !== undefined && (
                    <span className="text-2xs text-secondary tabular-nums">
                      {formatTimes(times)} cheaper
                    </span>
                  )}
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {formatFee(entry.value)}
                  </span>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
