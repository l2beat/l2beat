import { UnixTime } from '@l2beat/shared-pure'
import { useMemo } from 'react'
import { Line, LineChart, ReferenceLine } from 'recharts'
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
import type { GasFeesScale } from './GasFeesView'
import {
  formatFee,
  formatFeeTick,
  formatTimes,
  GAS_FEES_METRIC_LABELS,
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

interface Props {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrade[]
  data: GasFeesChartData | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  /** The metric of the data on screen, which lags `metric` while it loads */
  shownMetric: GasFeesMetric
  metric: GasFeesMetric
  setMetric: (metric: GasFeesMetric) => void
  scale: GasFeesScale
  setScale: (scale: GasFeesScale) => void
  highlightedChainId: string | undefined
  highlightedUpgradeId: string | undefined
  /** Controls set beside the title, such as the range */
  headerRight?: React.ReactNode
}

type Point = { timestamp: number } & Record<string, number | null>

export function GasFeesChart({
  chains,
  upgrades,
  data,
  isLoading,
  isPlaceholderData,
  shownMetric,
  metric,
  setMetric,
  scale,
  setScale,
  highlightedChainId,
  highlightedUpgradeId,
  headerRight,
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
  const upgradeLines = useMemo(
    () => getUpgradeLines(points, upgrades),
    [points, upgrades],
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
        {headerRight}
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
          {upgradeLines.map((line) => {
            const highlighted = line.id === highlightedUpgradeId
            return (
              <ReferenceLine
                key={line.id}
                x={line.x}
                stroke={highlighted ? 'var(--brand)' : 'var(--secondary)'}
                strokeOpacity={
                  highlighted ? 1 : line.kind === 'upgrade' ? 0.6 : 0.35
                }
                strokeWidth={highlighted ? 2 : 1}
                strokeDasharray={line.kind === 'upgrade' ? '4 3' : '1 3'}
                label={
                  line.kind === 'upgrade' || highlighted
                    ? (props: { viewBox?: { x?: number; y?: number } }) => (
                        // A highlighted label takes a row of its own, below
                        // the others, which fade so it can't be misread
                        <text
                          x={(props.viewBox?.x ?? 0) + 4}
                          y={
                            (props.viewBox?.y ?? 0) +
                            11 +
                            (highlighted ? 2 : line.row) * 13
                          }
                          fontSize={11}
                          fontWeight={highlighted ? 700 : 500}
                          fill={
                            highlighted ? 'var(--brand)' : 'var(--secondary)'
                          }
                          fillOpacity={
                            highlightedUpgradeId && !highlighted ? 0.35 : 1
                          }
                          stroke="var(--surface-primary)"
                          strokeWidth={3}
                          paintOrder="stroke"
                        >
                          {line.label}
                        </text>
                      )
                    : undefined
                }
              />
            )
          })}
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

/**
 * One line per upgrade inside the data, snapped to the first point on or
 * after its date. Close labels alternate between two rows.
 */
function getUpgradeLines(
  points: Point[] | undefined,
  upgrades: GasFeesUpgrade[],
) {
  if (!points?.length) return []
  const first = points[0]?.timestamp ?? 0
  const last = points[points.length - 1]?.timestamp ?? 0
  const span = last - first
  const lines: {
    id: string
    kind: GasFeesUpgrade['kind']
    x: number
    label: string
    row: number
  }[] = []
  let lastLabelled: { x: number; row: number } | undefined
  for (const upgrade of [...upgrades].reverse()) {
    const at = upgrade.timestamp
    if (at === null || at < first || at > last) continue
    const point = points.find((p) => p.timestamp >= at)
    if (!point) continue
    const crowded =
      lastLabelled !== undefined &&
      (point.timestamp - lastLabelled.x) / span < 0.06
    const row =
      upgrade.kind === 'upgrade' && crowded ? 1 - (lastLabelled?.row ?? 0) : 0
    if (upgrade.kind === 'upgrade') {
      lastLabelled = { x: point.timestamp, row }
    }
    lines.push({
      id: upgrade.id,
      kind: upgrade.kind,
      x: point.timestamp,
      label: upgrade.title,
      row,
    })
  }
  return lines
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
