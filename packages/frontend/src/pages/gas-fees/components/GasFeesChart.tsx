import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { scaleLog } from 'd3-scale'
import { useMemo } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartReferenceArea,
  type ChartReferenceDot,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import type { GasFeesChartData } from '~/server/features/gas-fees/getGasFeesChart'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  GAS_FEES_GAS_METRICS,
  GAS_FEES_USD_METRICS,
  type GasFeesMetric,
  type GasFeesUnit,
  isGasMetric,
} from '~/server/features/gas-fees/types'
import { formatRange } from '~/utils/dates'
import type { GasFeesScale } from './GasFeesView'
import {
  formatFee,
  formatFeeTick,
  formatGasNumber,
  formatGasPrice,
  formatGasPriceTick,
  formatTimes,
  GAS_FEES_METRIC_LABELS,
} from './metrics'
import type { GasFeesChain } from './types'

/** Every L2 as one line */
const L2S_KEY = 'l2s'

/** Ethereum, the L2s combined and the four busiest L2s; the rest are one legend click away */
const DEFAULT_VISIBLE_CHAINS = [
  'ethereum',
  'base',
  'arbitrum',
  'unichain',
  'optimism',
  L2S_KEY,
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
  unit: GasFeesUnit
  setUnit: (unit: GasFeesUnit) => void
  rangeControl: React.ReactNode
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
  unit,
  setUnit,
  rangeControl,
}: Props) {
  const isGas = isGasMetric(shownMetric)
  const meta = useMemo<ChartMeta>(() => {
    const entries: [string, ChartMeta[string]][] = chains.map((chain) => [
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
    ])
    // Right after Ethereum in the legend, as the line to compare it with
    entries.splice(1, 0, [
      L2S_KEY,
      {
        label: 'L2s combined',
        color: 'var(--primary)',
        indicatorType: { shape: 'line' },
      },
    ])
    return Object.fromEntries(entries)
  }, [chains])
  const hidden = useMemo(
    () =>
      chains
        .filter((c) => !DEFAULT_VISIBLE_CHAINS.includes(c.id))
        .map((c) => c.id),
    [chains],
  )
  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(meta, hidden)
  const shownKeys = dataKeys.map(String)

  const points = useMemo<Point[] | undefined>(
    () =>
      data?.chart.map(([timestamp, ...values]) => {
        const point: Point = { timestamp }
        chains.forEach((chain, i) => {
          point[chain.id] = values[i] ?? null
        })
        point[L2S_KEY] = values[chains.length] ?? null
        return point
      }),
    [data, chains],
  )

  const yAxis = getYAxis(points, shownKeys, scale, isGas)
  // Upgrades sit under the chart as milestones; the one hovered in the list
  // also gets a bar
  const markers = getUpgradeMarker(
    points,
    upgrades.find((u) => u.id === highlightedUpgradeId),
    yAxis.top,
  )
  const milestones = useMemo(() => toMilestones(upgrades), [upgrades])
  const timeRange = useMemo(() => getChartTimeRangeFromData(points), [points])

  return (
    <div className="flex flex-col gap-3">
      <ChartControlsWrapper className="flex-wrap items-start">
        <div>
          <h2 className="font-bold text-xl">
            {GAS_FEES_METRIC_LABELS[shownMetric].title}
            {isGas && (
              <span className="font-normal text-secondary"> · gwei</span>
            )}
          </h2>
          <ChartTimeRange
            isPlaceholderData={isPlaceholderData}
            timeRange={timeRange}
          />
        </div>
        <div className="flex gap-2">
          <RadioGroup
            name="gasFeesUnit"
            value={unit}
            onValueChange={(value) => setUnit(value as GasFeesUnit)}
          >
            <RadioGroupItem value="usd">USD</RadioGroupItem>
            <RadioGroupItem value="gas">Gas price</RadioGroupItem>
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
      </ChartControlsWrapper>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <RadioGroup
          name="gasFeesMetric"
          value={metric}
          onValueChange={(value) => setMetric(value as GasFeesMetric)}
          className="max-w-full overflow-x-auto"
        >
          {(unit === 'usd' ? GAS_FEES_USD_METRICS : GAS_FEES_GAS_METRICS).map(
            (m) => (
              <RadioGroupItem key={m} value={m} className="whitespace-nowrap">
                {GAS_FEES_METRIC_LABELS[m].short}
              </RadioGroupItem>
            ),
          )}
        </RadioGroup>
        {rangeControl}
      </div>
      <ChartContainer
        data={points}
        meta={meta}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        interactiveLegend={{ dataKeys: shownKeys, onItemClick: toggleDataKey }}
        noDataSourceMessage="Select at least one chain"
        milestones={milestones}
        size="large"
        legend
        legendLeading={
          <ChartLegendToggleAll
            showAllSelected={showAllSelected}
            onToggleAll={toggleAllDataKeys}
          />
        }
      >
        <TimeSeriesChart
          data={points}
          ariaLabel={GAS_FEES_METRIC_LABELS[shownMetric].title}
          series={[
            ...chains.map((chain) => ({
              key: chain.id,
              stroke: chain.color,
              strokeWidth: chain.id === 'ethereum' ? 2.5 : 1.75,
            })),
            { key: L2S_KEY, stroke: 'var(--primary)', strokeWidth: 2.5 },
          ]}
          highlight={highlightedChainId}
          yAxis={yAxis.options}
          referenceAreas={markers.areas}
          referenceDots={markers.labels}
          renderTooltip={(row, keys) => (
            <GasFeesTooltip
              row={row}
              keys={keys}
              smoothed={data?.smoothed ?? false}
              isGas={isGas}
            />
          )}
        />
      </ChartContainer>
    </div>
  )
}

/** Log: whole powers of ten, so every gridline is 10× the one below */
function getYAxis(
  points: Point[] | undefined,
  keys: string[],
  scale: GasFeesScale,
  isGas: boolean,
) {
  if (scale === 'lin') {
    return {
      options: { tickCount: 4, format: isGas ? formatGasNumber : formatFee },
      top: undefined,
    }
  }
  let min = Number.POSITIVE_INFINITY
  let max = 0
  for (const point of points ?? []) {
    for (const key of keys) {
      const value = point[key]
      if (typeof value === 'number' && value > 0) {
        min = Math.min(min, value)
        max = Math.max(max, value)
      }
    }
  }
  if (max === 0) return { options: { tickCount: 4 }, top: undefined }
  const lo = Math.floor(Math.log10(min))
  const hi = Math.ceil(Math.log10(max))
  const ticks = Array.from({ length: hi - lo + 1 }, (_, i) => 10 ** (lo + i))
  return {
    options: {
      scale: scaleLog,
      domain: [10 ** lo, 10 ** hi] as const,
      ticks,
      format: isGas ? formatGasPriceTick : formatFeeTick,
    },
    top: 10 ** hi,
  }
}

/**
 * A bar at the selected upgrade, named above the plot, where no line
 * crosses the label
 */
function getUpgradeMarker(
  points: Point[] | undefined,
  upgrade: GasFeesUpgrade | undefined,
  top: number | undefined,
): { areas: ChartReferenceArea[]; labels: ChartReferenceDot[] } {
  const first = points?.[0]?.timestamp
  const last = points?.at(-1)?.timestamp
  const at = upgrade?.timestamp
  if (
    !upgrade ||
    first === undefined ||
    last === undefined ||
    at === null ||
    at === undefined ||
    at < first ||
    at > last
  ) {
    return { areas: [], labels: [] }
  }
  const width = Math.max(UnixTime.DAY, (last - first) / 200)
  return {
    areas: [{ x1: at, x2: at + width, fill: 'var(--brand)', fillOpacity: 0.9 }],
    labels:
      top === undefined
        ? []
        : [
            {
              x: at,
              y: top,
              r: 0,
              label: {
                text: upgrade.title,
                position: 'top',
                offset: 5,
                fill: 'var(--brand)',
                fontWeight: 700,
              },
            },
          ],
  }
}

function toMilestones(upgrades: GasFeesUpgrade[]): Milestone[] {
  return upgrades.flatMap((upgrade) =>
    upgrade.timestamp === null || upgrade.kind === 'next'
      ? []
      : [
          {
            type: 'general',
            title: upgrade.title,
            description: upgrade.summary,
            url: upgrade.url,
            date: UnixTime.toDate(upgrade.timestamp).toISOString(),
          },
        ],
  )
}

function GasFeesTooltip({
  row,
  keys,
  smoothed,
  isGas,
}: {
  row: Point
  keys: string[]
  smoothed: boolean
  isGas: boolean
}) {
  const entries = getTooltipEntries(row, keys, { skipNull: true }).sort(
    (a, b) => b.value - a.value,
  )
  if (entries.length === 0) return null
  const ethereum = row.ethereum
  const t = row.timestamp

  return (
    <ChartTooltipWrapper>
      <div className="flex w-72 flex-col">
        <div className="font-medium text-label-value-14 text-secondary">
          {/* A daily bucket, or the week a 7-day average covers */}
          {smoothed
            ? formatRange(t - 6 * UnixTime.DAY, t + UnixTime.DAY)
            : formatRange(t, t + UnixTime.DAY)}
          {smoothed && <span className="block text-2xs">7-day average</span>}
        </div>
        <div className="mt-2 flex flex-col gap-2">
          {entries.map((entry) => {
            // Gas is priced differently per chain, so only fees compare
            const times =
              !isGas &&
              entry.name !== 'ethereum' &&
              typeof ethereum === 'number'
                ? ethereum / entry.value
                : undefined
            return (
              <ChartTooltipRow
                key={entry.name}
                name={entry.name}
                gap="gap-x-3"
                wrapLabel={false}
              >
                <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                  {times !== undefined && (
                    <span className="text-2xs text-secondary tabular-nums">
                      {formatTimes(times)} cheaper
                    </span>
                  )}
                  <span className="font-medium text-label-value-15 text-primary tabular-nums">
                    {isGas
                      ? formatGasPrice(entry.value)
                      : formatFee(entry.value)}
                  </span>
                </span>
              </ChartTooltipRow>
            )
          })}
        </div>
      </div>
    </ChartTooltipWrapper>
  )
}
