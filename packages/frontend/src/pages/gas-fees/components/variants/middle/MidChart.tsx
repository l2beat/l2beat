import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { scaleLog } from 'd3-scale'
import { useMemo, useRef } from 'react'
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
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { useTracking } from '~/hooks/useTracking'
import type { GasFeesChartData } from '~/server/features/gas-fees/getGasFeesChart'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  GAS_FEES_GAS_METRICS,
  GAS_FEES_USD_METRICS,
  type GasFeesMetric,
  type GasFeesUnit,
  isGasMetric,
} from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import type { GasFeesScale } from '../../GasFeesView'
import {
  formatFee,
  formatFeeTick,
  formatGasNumber,
  formatGasPrice,
  formatGasPriceTick,
  formatTimes,
  GAS_FEES_METRIC_LABELS,
} from '../../metrics'
import type { GasFeesChain } from '../../types'

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
  /** Clicked in the upgrades list: marked with a band around it as well */
  selectedUpgradeId?: string
  unit: GasFeesUnit
  setUnit: (unit: GasFeesUnit) => void
  rangeControl: React.ReactNode
  /**
   * `milestones`: the chart's own milestone diamonds under the plot. `lines`:
   * a hairline through the plot at every upgrade in range instead, the
   * protocol upgrades a step stronger than the gas limit raises.
   */
  upgradeMarks?: 'milestones' | 'lines' | 'none'
  /**
   * `row` puts every control on one line beside the title on wide cards.
   * `tiered`: the title with the range across from it, then the metric as
   * tabs with the unit and scale as small quiet toggles at their end.
   */
  layout?: 'stacked' | 'row' | 'tiered'
  /** Replaces the title over the controls */
  heading?: React.ReactNode
  /** Between the controls and the plot, e.g. upgrade flags */
  abovePlot?: React.ReactNode
  /** The plot's height, as ChartContainer classes */
  plotClassName?: string
  /** Off when the upgrades are named elsewhere, e.g. by flags over the plot */
  markerLabels?: boolean
}

type Point = { timestamp: number } & Record<string, number | null>

export function MidChart({
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
  selectedUpgradeId,
  unit,
  setUnit,
  rangeControl,
  upgradeMarks = 'milestones',
  layout = 'stacked',
  heading,
  abovePlot,
  plotClassName,
  markerLabels = true,
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
  // The plot's width, so an upgrade's line is one pixel wide, as its stem
  const plotRef = useRef<HTMLDivElement>(null)
  const { width: plotWidth } = useResizeObserver({ ref: plotRef })
  // Upgrades sit under the chart as milestones. The one hovered in the list
  // also gets a line, and the one clicked a line with a band around it.
  const markers = getUpgradeMarkers(
    points,
    upgrades.find((u) => u.id === selectedUpgradeId),
    upgrades.find(
      (u) => u.id === highlightedUpgradeId && u.id !== selectedUpgradeId,
    ),
    yAxis.top,
    plotWidth,
  )
  const milestones = useMemo(() => toMilestones(upgrades), [upgrades])
  const lines = useMemo(
    () =>
      upgradeMarks === 'lines'
        ? getUpgradeLines(points, upgrades, plotWidth)
        : [],
    [upgradeMarks, points, upgrades, plotWidth],
  )
  const timeRange = useMemo(() => getChartTimeRangeFromData(points), [points])

  const title = (
    <h3 className="font-bold text-lg">
      {GAS_FEES_METRIC_LABELS[shownMetric].title}
      {isGas && <span className="font-normal text-secondary"> · gwei</span>}
    </h3>
  )
  const unitControl = (
    <RadioGroup
      name="gasFeesUnit"
      value={unit}
      onValueChange={(value) => setUnit(value as GasFeesUnit)}
    >
      <RadioGroupItem value="usd">USD</RadioGroupItem>
      <RadioGroupItem value="gas">Gas price</RadioGroupItem>
    </RadioGroup>
  )
  const scaleControl = (
    <RadioGroup
      name="gasFeesScale"
      value={scale}
      onValueChange={(value) => setScale(value as GasFeesScale)}
    >
      <RadioGroupItem value="log">Log</RadioGroupItem>
      <RadioGroupItem value="lin">Lin</RadioGroupItem>
    </RadioGroup>
  )
  const metricControl = (
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
  )

  return (
    <div className="flex flex-col gap-3">
      {layout === 'tiered' ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="min-w-0">
              {heading ?? title}
              <ChartTimeRange
                isPlaceholderData={isPlaceholderData}
                timeRange={timeRange}
              />
            </div>
            {rangeControl}
          </div>
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-divider border-b">
            <MetricTabs
              metrics={
                unit === 'usd' ? GAS_FEES_USD_METRICS : GAS_FEES_GAS_METRICS
              }
              value={metric}
              onChange={setMetric}
            />
            <div className="flex items-center gap-3 pb-2 max-md:w-full max-md:justify-end">
              <QuietToggle
                name="gasFeesUnit"
                label="Unit"
                value={unit}
                onChange={(value) => setUnit(value as GasFeesUnit)}
                options={[
                  { value: 'usd', label: 'USD' },
                  { value: 'gas', label: 'Gas' },
                ]}
              />
              <QuietToggle
                name="gasFeesScale"
                label="Scale"
                value={scale}
                onChange={(value) => setScale(value as GasFeesScale)}
                options={[
                  { value: 'log', label: 'Log' },
                  { value: 'lin', label: 'Lin' },
                ]}
              />
            </div>
          </div>
        </div>
      ) : layout === 'row' ? (
        <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            {heading ?? title}
            <ChartTimeRange
              isPlaceholderData={isPlaceholderData}
              timeRange={timeRange}
            />
          </div>
          <div className="flex max-w-full flex-wrap items-center gap-2">
            {metricControl}
            {unitControl}
            {scaleControl}
            {rangeControl}
          </div>
        </div>
      ) : (
        <>
          <ChartControlsWrapper className="flex-wrap items-start">
            <div>
              {heading ?? title}
              <ChartTimeRange
                isPlaceholderData={isPlaceholderData}
                timeRange={timeRange}
              />
            </div>
            <div className="flex gap-2">
              {unitControl}
              {scaleControl}
            </div>
          </ChartControlsWrapper>
          <div className="flex flex-wrap items-center justify-between gap-2">
            {metricControl}
            {rangeControl}
          </div>
        </>
      )}
      {abovePlot}
      <div ref={plotRef}>
        <ChartContainer
          data={points}
          meta={meta}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          interactiveLegend={{
            dataKeys: shownKeys,
            onItemClick: toggleDataKey,
          }}
          noDataSourceMessage="Select at least one chain"
          milestones={upgradeMarks === 'milestones' ? milestones : undefined}
          size="large"
          className={plotClassName}
          // One line needs no legend
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
            referenceAreas={[...lines, ...markers.areas]}
            referenceDots={markerLabels ? markers.labels : undefined}
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
    </div>
  )
}

/**
 * The metric as a tab bar: quiet names, the picked one in full strength
 * over a brand underline that sits on the bar's hairline
 */
function MetricTabs({
  metrics,
  value,
  onChange,
}: {
  metrics: readonly GasFeesMetric[]
  value: GasFeesMetric
  onChange: (metric: GasFeesMetric) => void
}) {
  const { track } = useTracking()
  return (
    <RadioGroupPrimitive.Root
      aria-label="Metric"
      value={value}
      onValueChange={(v) => {
        onChange(v as GasFeesMetric)
        track('radioGroupChanged', { name: 'gasFeesMetric', value: v })
      }}
      className="-mb-px scrollbar-hide flex max-w-full gap-4 overflow-x-auto md:gap-5"
    >
      {metrics.map((m) => (
        <RadioGroupPrimitive.Item
          key={m}
          value={m}
          className={cn(
            'whitespace-nowrap border-transparent border-b-2 pt-1 pb-2 font-semibold text-[13px] text-secondary transition-colors hover:text-primary md:text-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            'data-[state=checked]:border-brand data-[state=checked]:text-primary',
          )}
        >
          {GAS_FEES_METRIC_LABELS[m].short}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  )
}

/** A small two-way setting: a tracked label and two compact options */
function QuietToggle({
  name,
  label,
  value,
  onChange,
  options,
}: {
  name: string
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const { track } = useTracking()
  return (
    <span className="flex items-center gap-1.5">
      <span className="font-semibold text-3xs text-secondary uppercase tracking-wider">
        {label}
      </span>
      <RadioGroupPrimitive.Root
        aria-label={label}
        value={value}
        onValueChange={(v) => {
          onChange(v)
          track('radioGroupChanged', { name, value: v })
        }}
        className="flex h-6 items-center rounded-md border border-divider p-0.5"
      >
        {options.map((o) => (
          <RadioGroupPrimitive.Item
            key={o.value}
            value={o.value}
            className={cn(
              'h-full rounded-[4px] px-1.5 font-medium text-2xs text-secondary transition-colors hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              'data-[state=checked]:bg-surface-secondary data-[state=checked]:text-primary',
            )}
          >
            {o.label}
          </RadioGroupPrimitive.Item>
        ))}
      </RadioGroupPrimitive.Root>
    </span>
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

interface UpgradeMarkers {
  areas: ChartReferenceArea[]
  labels: ChartReferenceDot[]
}

/** The clicked upgrade first, so the hovered one's line draws over its band */
function getUpgradeMarkers(
  points: Point[] | undefined,
  selected: GasFeesUpgrade | undefined,
  hovered: GasFeesUpgrade | undefined,
  top: number | undefined,
  plotWidth: number | undefined,
): UpgradeMarkers {
  const a = getUpgradeMarker(points, selected, top, true, plotWidth)
  const b = getUpgradeMarker(points, hovered, top, false, plotWidth)
  return {
    areas: [...a.areas, ...b.areas],
    // One name above the plot: two would overlap when the upgrades are close
    labels: b.labels.length > 0 ? b.labels : a.labels,
  }
}

/**
 * A hovered upgrade: a hairline in pink at its date, named above the plot
 * where no line crosses the label. A clicked one: a faint pink wash from its
 * date to today, the stretch it has been in effect, and the same pink line.
 */
function getUpgradeMarker(
  points: Point[] | undefined,
  upgrade: GasFeesUpgrade | undefined,
  top: number | undefined,
  withBand: boolean,
  plotWidth: number | undefined,
): UpgradeMarkers {
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
  const line: ChartReferenceArea = {
    x1: at,
    x2: at + onePixel(first, last, plotWidth),
    fill: 'var(--brand)',
    fillOpacity: 0.85,
  }
  const since: ChartReferenceArea = {
    x1: at,
    x2: last,
    fill: 'var(--brand)',
    fillOpacity: 0.06,
  }
  return {
    areas: withBand ? [since, line] : [line],
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

/** How much time one pixel of the plot spans */
function onePixel(first: number, last: number, plotWidth: number | undefined) {
  return (last - first) / Math.max(1, plotWidth ?? 900)
}

/**
 * A hairline per upgrade in the chart's range, one pixel wide and as faint
 * as the flag stems above the plot, so each reads as one line from the name
 * down to the axis
 */
function getUpgradeLines(
  points: Point[] | undefined,
  upgrades: GasFeesUpgrade[],
  plotWidth: number | undefined,
): ChartReferenceArea[] {
  const first = points?.[0]?.timestamp
  const last = points?.at(-1)?.timestamp
  if (first === undefined || last === undefined) return []
  const width = onePixel(first, last, plotWidth)
  return upgrades.flatMap((u) =>
    u.timestamp === null || u.timestamp < first || u.timestamp > last
      ? []
      : [
          {
            x1: u.timestamp,
            x2: u.timestamp + width,
            fill: 'var(--secondary)',
            fillOpacity: u.kind === 'gasLimit' ? 0.15 : 0.2,
          },
        ],
  )
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
