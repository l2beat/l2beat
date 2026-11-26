import { UnixTime } from '@l2beat/shared-pure'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { scaleLog } from 'd3-scale'
import { useMemo, useRef, useState } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import {
  ChartTooltipRow,
  ChartTooltipWrapper,
  getTooltipEntries,
} from '~/components/core/chart/ChartTooltip'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartReferenceArea,
  TimeSeriesChart,
} from '~/components/core/chart/TimeSeriesChart'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { useTracking } from '~/hooks/useTracking'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import {
  GAS_FEES_GAS_METRICS,
  GAS_FEES_USD_METRICS,
  type GasFeesGasMetric,
  type GasFeesMetric,
  type GasFeesUnit,
  type GasFeesUsdMetric,
  isGasMetric,
} from '~/server/features/gas-fees/types'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import { DOT_SEPARATOR } from '~/utils/dotSeparator'
import type { ChartRange } from '~/utils/range/range'
import {
  compareWithEthereum,
  formatFee,
  formatFeeTick,
  formatGasNumber,
  formatGasPrice,
  formatGasPriceTick,
} from './format'
import { GasFeesUpgradeFlags } from './GasFeesUpgradeFlags'
import { getDecadeDomain, getDecades } from './logScale'
import {
  DEFAULT_GAS_FEES_GAS_METRIC,
  DEFAULT_GAS_FEES_METRIC,
  GAS_FEES_METRIC_LABELS,
  GAS_FEES_RANGE_LABELS,
  GAS_FEES_RANGE_OPTIONS,
} from './metrics'
import type { GasFeesChain } from './types'
import type { UpgradeSelection } from './useUpgradeSelection'

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
  range: ChartRange
  setRange: (range: ChartRange) => void
  highlightedChainId: string | undefined
  selection: UpgradeSelection
}

type Scale = 'log' | 'lin'
type Point = { timestamp: number } & Record<string, number | null>

export function GasFeesChart({
  chains,
  upgrades,
  range,
  setRange,
  highlightedChainId,
  selection,
}: Props) {
  const trpc = useTRPC()
  const [unit, setUnit] = useState<GasFeesUnit>('usd')
  // Each unit keeps its own metric, so switching back restores it
  const [usdMetric, setUsdMetric] = useState<GasFeesUsdMetric>(
    DEFAULT_GAS_FEES_METRIC,
  )
  const [gasMetric, setGasMetric] = useState<GasFeesGasMetric>(
    DEFAULT_GAS_FEES_GAS_METRIC,
  )
  const metric = unit === 'usd' ? usdMetric : gasMetric
  const setMetric = (m: GasFeesMetric) =>
    isGasMetric(m) ? setGasMetric(m) : setUsdMetric(m)
  const [scale, setScale] = useState<Scale>('log')
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.gasFees.chart,
    { range, metric },
  )
  // The metric of the data on screen, which lags `metric` while it loads
  const shownMetric = shownInput.metric
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
  // The L2s have no median fee as one chain, so no line to key
  const legendMeta = useMemo(
    () =>
      shownMetric === 'medianFee'
        ? Object.fromEntries(
            Object.entries(meta).filter(([key]) => key !== L2S_KEY),
          )
        : meta,
    [meta, shownMetric],
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
  // The plot's width, so an upgrade's line is one pixel wide, as its flag's stem
  const plotRef = useRef<HTMLDivElement>(null)
  const { width: plotWidth } = useResizeObserver({ ref: plotRef })
  const domain = useMemo<[number, number] | undefined>(() => {
    const first = points?.[0]?.timestamp
    const last = points?.at(-1)?.timestamp
    return first !== undefined && last !== undefined ? [first, last] : undefined
  }, [points])
  const upgradeMarks = useMemo(
    () =>
      domain ? getUpgradeMarks(upgrades, domain, plotWidth, selection) : [],
    [upgrades, domain, plotWidth, selection],
  )
  const timeRange = useMemo(() => getChartTimeRangeFromData(points), [points])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
          <div className="min-w-0">
            <h3 className="font-bold text-lg">
              {GAS_FEES_METRIC_LABELS[shownMetric].title}
              {isGas && (
                <span className="font-normal text-secondary">
                  {DOT_SEPARATOR}gwei
                </span>
              )}
            </h3>
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
              label: GAS_FEES_RANGE_LABELS[value],
            }))}
          />
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
              onChange={(value) => setScale(value as Scale)}
              options={[
                { value: 'log', label: 'Log' },
                { value: 'lin', label: 'Lin' },
              ]}
            />
          </div>
        </div>
      </div>
      <GasFeesUpgradeFlags
        upgrades={upgrades}
        domain={isLoading ? undefined : domain}
        selection={selection}
      />
      <div ref={plotRef}>
        <ChartContainer
          data={points}
          meta={legendMeta}
          isLoading={isLoading}
          isPlaceholderData={isPlaceholderData}
          interactiveLegend={{
            dataKeys: shownKeys,
            onItemClick: toggleDataKey,
          }}
          noDataSourceMessage="Select at least one chain"
          size="large"
          className="md:h-[400px] md:min-h-[400px]"
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
                isolatedDots: {},
              })),
              {
                key: L2S_KEY,
                stroke: 'var(--primary)',
                strokeWidth: 2.5,
                isolatedDots: {},
              },
            ]}
            highlight={highlightedChainId}
            yAxis={yAxis}
            referenceAreas={upgradeMarks}
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

/** The metric as a tab bar, the picked one over a brand underline that sits on the bar's hairline */
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
      onValueChange={(picked) => {
        onChange(picked as GasFeesMetric)
        track('radioGroupChanged', { name: 'gasFeesMetric', value: picked })
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

/** A small two-way setting, quieter than the range it sits under */
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
      <span className="font-semibold text-3xs uppercase tracking-wider">
        {label}
      </span>
      <RadioGroupPrimitive.Root
        aria-label={label}
        value={value}
        onValueChange={(picked) => {
          onChange(picked)
          track('radioGroupChanged', { name, value: picked })
        }}
        className="flex h-6 items-center rounded-md border border-divider p-0.5"
      >
        {options.map((option) => (
          <RadioGroupPrimitive.Item
            key={option.value}
            value={option.value}
            className={cn(
              'h-full rounded-[4px] px-1.5 font-medium text-2xs text-secondary transition-colors hover:text-primary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              'data-[state=checked]:bg-surface-secondary data-[state=checked]:text-primary',
            )}
          >
            {option.label}
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
  scale: Scale,
  isGas: boolean,
) {
  if (scale === 'lin') {
    return { tickCount: 4, format: isGas ? formatGasNumber : formatFee }
  }
  const domain = getDecadeDomain(
    (points ?? []).flatMap((point) => keys.flatMap((key) => point[key] ?? [])),
  )
  if (!domain) return { tickCount: 4 }
  return {
    scale: scaleLog,
    domain: [10 ** domain.lo, 10 ** domain.hi] as const,
    ticks: getDecades(domain).map((power) => 10 ** power),
    format: isGas ? formatGasPriceTick : formatFeeTick,
  }
}

/**
 * A hairline at every upgrade on the plot, one pixel wide so it continues its
 * flag's stem. The hovered and the clicked one are pink, and the clicked one
 * also tints the plot from its day on: the stretch it has been in effect.
 */
function getUpgradeMarks(
  upgrades: GasFeesUpgrade[],
  [first, last]: [number, number],
  plotWidth: number | undefined,
  selection: UpgradeSelection,
): ChartReferenceArea[] {
  const pixel = (last - first) / Math.max(1, plotWidth ?? 900)
  const lines: ChartReferenceArea[] = []
  const since: ChartReferenceArea[] = []
  for (const upgrade of upgrades) {
    const at = upgrade.timestamp
    if (at === null || at < first || at > last) continue
    const isActive = selection.isActive(upgrade.id)
    lines.push({
      x1: at,
      x2: at + pixel,
      fill: isActive ? 'var(--brand)' : 'var(--secondary)',
      fillOpacity: isActive ? 0.85 : upgrade.kind === 'gasLimit' ? 0.15 : 0.2,
    })
    if (selection.isSelected(upgrade.id)) {
      since.push({ x1: at, x2: last, fill: 'var(--brand)', fillOpacity: 0.06 })
    }
  }
  return [...since, ...lines]
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
            const compared =
              !isGas &&
              entry.name !== 'ethereum' &&
              typeof ethereum === 'number'
                ? compareWithEthereum(ethereum / entry.value)
                : undefined
            return (
              <ChartTooltipRow
                key={entry.name}
                name={entry.name}
                gap="gap-x-3"
                wrapLabel={false}
              >
                <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                  {compared && (
                    <span className="text-2xs text-secondary tabular-nums">
                      {compared.times} {compared.word}
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
