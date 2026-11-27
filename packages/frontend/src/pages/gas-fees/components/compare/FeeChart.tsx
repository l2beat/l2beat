import { scaleLog } from 'd3-scale'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ChartContainer } from '~/components/core/chart/ChartContainer'
import type { ChartMeta } from '~/components/core/chart/ChartContext'
import { ChartLegendToggleAll } from '~/components/core/chart/ChartLegendToggleAll'
import { ChartRangeControls } from '~/components/core/chart/ChartRangeControls'
import { ChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartDataKeys } from '~/components/core/chart/hooks/useChartDataKeys'
import {
  type ChartSeries,
  TimeSeriesChart,
  type TimeSeriesChartHandle,
} from '~/components/core/chart/TimeSeriesChart'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { RadioGroup, RadioGroupItem } from '~/components/core/RadioGroup'
import { useIsOnScreen } from '~/hooks/useIsOnScreen'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import {
  GAS_FEES_CHART_KEYS,
  type GasFeesChartKey,
} from '~/server/features/gas-fees/chains'
import type { GasFeesMetric } from '~/server/features/gas-fees/daily/metrics'
import type { GasFeesChain } from '~/server/features/gas-fees/getGasFeesChains'
import type { GasFeesUpgrades } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { type ChartRange, optionToRange } from '~/utils/range/range'
import { formatGwei, formatUsd } from '../../utils/format'
import { decadesOf, logScaleOf } from '../../utils/logScale'
import {
  DEFAULT_METRIC,
  type FeeUnit,
  METRIC_LABELS,
  metricsOf,
  unitOf,
} from '../../utils/metricLabels'
import { GAS_FEES_RANGES } from '../../utils/ranges'
import { useChainHighlight } from '../ChainHighlight'
import { FeeChartTooltip } from './FeeChartTooltip'
import { type PlotRect, UpgradeOverlay } from './UpgradeOverlay'
import { UpgradeStrip } from './UpgradeStrip'
import { useUpgradeSelection } from './useUpgradeSelection'

export type FeeChartRow = { timestamp: number } & Partial<
  Record<GasFeesChartKey, number | null>
>

const SHOWN_AT_FIRST: GasFeesChartKey[] = [
  'ethereum',
  'l2s',
  'base',
  'arbitrum',
  'unichain',
  'optimism',
]
const RANGE_OPTIONS = GAS_FEES_RANGES.map(({ value, label }) => ({
  value,
  label,
}))
/** Room above the plot for two lanes of upgrade flags */
const FLAGS_HEIGHT = 52
/** Taller than a regular chart: it is the card's main content */
const CHART_HEIGHT =
  'h-[260px] min-h-[260px] md:h-[400px] md:min-h-[400px] 2xl:h-[400px] 2xl:min-h-[400px]'

export function FeeChart({
  chains,
  upgrades,
  initialRange,
}: {
  chains: GasFeesChain[]
  upgrades: GasFeesUpgrades
  initialRange: ChartRange
}) {
  const trpc = useTRPC()
  const [range, setRange] = useState(initialRange)
  const [metric, setMetric] = useState<GasFeesMetric>(DEFAULT_METRIC)
  const [scale, setScale] = useState<'log' | 'lin'>('log')
  const { data, isLoading, isError, isPlaceholderData, shownInput } =
    useChartQuery(trpc.gasFees.chart, { range, metric })
  const shownMetric = shownInput.metric
  const unit = unitOf(metric)
  const selection = useUpgradeSelection(upgrades)
  const highlight = useChainHighlight()

  const rows = useMemo(
    () =>
      data?.rows.map(([timestamp, ...values]) => {
        const row: FeeChartRow = { timestamp }
        GAS_FEES_CHART_KEYS.forEach((key, i) => {
          row[key] = values[i] ?? null
        })
        return row
      }),
    [data],
  )
  const meta = useMemo(
    () => getMeta(chains, shownMetric),
    [chains, shownMetric],
  )
  const hidden = useMemo(
    () => GAS_FEES_CHART_KEYS.filter((k) => !SHOWN_AT_FIRST.includes(k)),
    [],
  )
  const { dataKeys, toggleDataKey, toggleAllDataKeys, showAllSelected } =
    useChartDataKeys(meta, hidden)
  const visible = Object.keys(meta).filter((k) =>
    dataKeys.includes(k),
  ) as GasFeesChartKey[]

  const series: ChartSeries<GasFeesChartKey, FeeChartRow>[] = Object.entries(
    meta,
  ).map(([key, m]) => ({
    key: key as GasFeesChartKey,
    stroke: m?.color,
    strokeWidth: key === 'l2s' || key === 'ethereum' ? 2.25 : 1.5,
    // A priced day between two gaps has no line to be on
    isolatedDots: {},
  }))
  const values = (rows ?? []).flatMap((r) => visible.flatMap((k) => r[k] ?? []))
  const log = logScaleOf(values)
  const perGas = unitOf(shownMetric) === 'gas'
  const format = perGas ? formatGwei : formatUsd
  const unitSuffix = perGas ? ' gwei' : ''
  // Only a visible line can be highlighted, or every other line would fade
  const highlighted =
    highlight.chain && visible.includes(highlight.chain)
      ? highlight.chain
      : undefined

  const wrapperRef = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref: wrapperRef })
  const onScreen = useIsOnScreen(wrapperRef)
  const handle = useRef<TimeSeriesChartHandle>(null)
  const first = rows?.[0]?.timestamp
  const last = rows?.at(-1)?.timestamp
  const plot = usePlotRect(
    handle,
    `${onScreen}:${rows?.length}:${first}:${last}:${width}:${scale}:${shownMetric}:${visible.join()}`,
  )
  const earlier =
    first === undefined
      ? 0
      : upgrades.past.filter((u) => u.timestamp < first).length

  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-lg">{METRIC_LABELS[metric].title}</h3>
          <ChartTimeRange
            timeRange={
              first !== undefined && last !== undefined
                ? [first, last]
                : rows || isError
                  ? null
                  : undefined
            }
            isPlaceholderData={isPlaceholderData}
          />
        </div>
        <ChartRangeControls
          name="gasFeesChart"
          value={range}
          setValue={setRange}
          options={RANGE_OPTIONS}
        />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-2 border-divider border-b">
        <div className="flex gap-5 overflow-x-auto">
          {metricsOf(unit).map((tab) => (
            <button
              key={tab}
              type="button"
              aria-pressed={tab === metric}
              data-state={tab === metric ? 'checked' : 'unchecked'}
              onClick={() => setMetric(tab)}
              className="whitespace-nowrap border-transparent border-b-2 pt-1 pb-2 font-semibold text-[13px] text-secondary transition-colors hover:text-primary data-[state=checked]:border-brand data-[state=checked]:text-primary md:text-sm"
            >
              {METRIC_LABELS[tab].tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 pb-1.5">
          <Toggle
            label="Unit"
            value={unit}
            options={[
              { value: 'usd', label: 'USD' },
              { value: 'gas', label: 'Gas' },
            ]}
            onChange={(next: FeeUnit) => {
              if (next !== unit)
                setMetric(next === 'gas' ? 'gasPrice' : DEFAULT_METRIC)
            }}
          />
          <Toggle
            label="Scale"
            value={scale}
            options={[
              { value: 'log', label: 'Log' },
              { value: 'lin', label: 'Lin' },
            ]}
            onChange={setScale}
          />
        </div>
      </div>
      <div ref={wrapperRef}>
        {isError ? (
          <p
            className={cn(
              CHART_HEIGHT,
              'flex items-center justify-center text-secondary text-sm',
            )}
          >
            Couldn’t load the chart for this period.
          </p>
        ) : (
          <ChartContainer
            data={rows}
            meta={meta}
            isLoading={isLoading}
            isPlaceholderData={isPlaceholderData}
            className={CHART_HEIGHT}
            interactiveLegend={{ dataKeys, onItemClick: toggleDataKey }}
            legend
            legendLeading={
              <ChartLegendToggleAll
                showAllSelected={showAllSelected}
                onToggleAll={toggleAllDataKeys}
              />
            }
          >
            <TimeSeriesChart
              data={rows}
              series={series}
              ariaLabel={METRIC_LABELS[shownMetric].title}
              margin={{ top: FLAGS_HEIGHT }}
              highlight={highlighted}
              handleRef={handle}
              yAxis={
                scale === 'log'
                  ? {
                      scale: scaleLog,
                      domain: [10 ** log.min, 10 ** log.max],
                      ticks: decadesOf(log),
                      format,
                      unit: unitSuffix,
                    }
                  : { domain: 'zero', format, unit: unitSuffix }
              }
              renderTooltip={(row, keys) => (
                <FeeChartTooltip
                  row={row}
                  keys={keys}
                  weekly={data?.weekly ?? false}
                  format={(v) => `${format(v)}${unitSuffix}`}
                />
              )}
            />
            {plot && first !== undefined && last !== undefined && (
              <UpgradeOverlay
                selection={selection}
                plot={plot}
                domain={[first, last]}
              />
            )}
          </ChartContainer>
        )}
      </div>
      <UpgradeStrip
        selection={selection}
        earlier={earlier}
        onShowAll={() => setRange(optionToRange('max'))}
      />
    </section>
  )
}

function getMeta(chains: GasFeesChain[], metric: GasFeesMetric): ChartMeta {
  const perGas = unitOf(metric) === 'gas'
  const line = { shape: 'line' } as const
  const meta: ChartMeta = {}
  for (const chain of chains) {
    // A price per gas in another token has no place on this axis
    if (perGas && chain.gasToken !== 'ETH') continue
    meta[chain.id] = {
      label: chain.name,
      color: chain.color,
      indicatorType: line,
    }
    // No median can be had for the L2s together
    if (chain.id === 'ethereum' && metric !== 'medianFee') {
      meta.l2s = {
        label: perGas ? 'L2s combined, ETH gas' : 'L2s combined',
        color: 'var(--primary)',
        indicatorType: line,
      }
    }
  }
  return meta
}

/** The chart draws a few frames after its data, and not at all off screen or without data */
const PLOT_READS = 30

/** The plot's box, read once the chart has drawn */
function usePlotRect(
  handle: React.RefObject<TimeSeriesChartHandle | null>,
  /** Changes whenever the chart redraws */
  redraw: string,
) {
  const [rect, setRect] = useState<PlotRect>()
  // biome-ignore lint/correctness/useExhaustiveDependencies: redraw is what makes the box worth reading again
  useEffect(() => {
    let reads = PLOT_READS
    let frame = requestAnimationFrame(function read() {
      const next = handle.current?.getPlotRect()
      if (!next) {
        if (--reads > 0) frame = requestAnimationFrame(read)
        return
      }
      setRect((prev) =>
        prev &&
        prev.x === next.x &&
        prev.y === next.y &&
        prev.width === next.width &&
        prev.height === next.height
          ? prev
          : next,
      )
    })
    return () => cancelAnimationFrame(frame)
  }, [handle, redraw])
  return rect
}

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="font-semibold text-[10px] uppercase tracking-wider">
        {label}
      </span>
      <RadioGroup
        name={`gasFees${label}`}
        value={value}
        onValueChange={(v) => onChange(v as T)}
        className="h-6"
      >
        {options.map((o) => (
          <RadioGroupItem
            key={o.value}
            value={o.value}
            className={cn('px-1.5 text-2xs md:text-2xs')}
          >
            {o.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
    </div>
  )
}
