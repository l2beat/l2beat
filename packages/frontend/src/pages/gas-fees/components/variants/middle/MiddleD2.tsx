import { useCallback, useMemo } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import type { GasFeesUpgrade } from '~/server/features/gas-fees/getGasFeesUpgrades'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'
import { optionToRange } from '~/utils/range/range'
import { GasFeesComparedL2s } from '../../GasFeesStats'
import {
  formatFee,
  formatFeeTick,
  formatTimes,
  getPeriodLabel,
} from '../../metrics'
import { ETH, L2, Label, percent, SPLIT, usd } from '../../parts'
import { FlowColumns } from './LabelledFlow'
import { MidChart } from './MidChart'
import { CardLabel, Colored, Legend, StatsSkeleton } from './pieces'
import {
  type Figures,
  getFigures,
  isUpgradeInRange,
  type MiddleCardProps,
  RangeControl,
  tokenColor,
} from './shared'
import { UpgradeFlags } from './UpgradeFlags'

/** Brand pink as text, readable on the card in both themes, as the top card has it */
const KEY = 'var(--brand-deep)'

/**
 * D2 · D with the flow given its room: the flow takes the wide column, its
 * bars broad enough to carry their shares and names inside, and the log
 * tracks move to the side column, so both rows split at the same divider
 */
export function MiddleD2(props: MiddleCardProps) {
  const { chains, upgrades, summary, chart, range, setRange } = props
  const f =
    summary.data && !summary.isLoading
      ? getFigures(summary.data.stats, getPeriodLabel(summary.range))
      : undefined
  const domain = useMemo<[number, number] | undefined>(() => {
    const first = chart.data?.chart[0]?.[0]
    const last = chart.data?.chart.at(-1)?.[0]
    return first !== undefined && last !== undefined ? [first, last] : undefined
  }, [chart.data])

  return (
    <div className="@container flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <CardLabel>Ethereum vs L2s{f && ` · ${f.period}`}</CardLabel>
          <GasFeesComparedL2s chains={chains} summary={summary.data} />
        </div>
        {f ? (
          <p className="max-w-[920px] font-bold text-2xl leading-[1.15] tracking-tight md:text-3xl">
            L2s process <Colored color={KEY}>{percent(f.txShare)}</Colored> of
            transactions and collect{' '}
            <Colored color={KEY}>{percent(f.feeShare)}</Colored> of the fees.
            <br className="@max-5xl:hidden" /> A transfer there costs{' '}
            <Colored color={KEY}>{formatTimes(f.timesCheaper)}</Colored> less.
          </p>
        ) : (
          <StatsSkeleton />
        )}
      </div>
      {f && (
        // The flow in the wide column, the costs it comes from beside it,
        // on the same divider as the chart and its side column below
        <div className={cn(SPLIT.grid, 'border-divider border-t pt-6')}>
          {/* The flow fills what the tracks beside it leave, the fees'
              tokens under it, so the row is only as tall as the tracks */}
          <div className={cn(SPLIT.main, 'flex flex-col gap-5')}>
            <FlowColumns
              f={f}
              className="@3xl:h-auto h-[260px] @3xl:min-h-[230px] @3xl:flex-1"
            />
            <PaidIn f={f} />
          </div>
          <div className={cn(SPLIT.side, SPLIT.sidePad, '@container')}>
            <CostTracks f={f} />
          </div>
        </div>
      )}
      {/* The fee history across the whole card, its upgrades flagged on it */}
      <div className="flex flex-col gap-4 border-divider border-t pt-6">
        <MidChart
          chains={chains}
          upgrades={upgrades}
          data={chart.data}
          isLoading={chart.isLoading}
          isPlaceholderData={chart.isPlaceholderData}
          shownMetric={chart.metric}
          metric={props.metric}
          setMetric={props.setMetric}
          scale={props.scale}
          setScale={props.setScale}
          highlightedChainId={props.highlightedChainId}
          highlightedUpgradeId={props.highlightedUpgradeId}
          selectedUpgradeId={props.selectedUpgradeId}
          unit={props.unit}
          setUnit={props.setUnit}
          rangeControl={<RangeControl range={range} setRange={setRange} />}
          layout="tiered"
          markerLabels={false}
          upgradeMarks="lines"
          plotClassName="md:h-[400px] md:min-h-[400px]"
          abovePlot={
            <UpgradeFlags
              look="label"
              upgrades={upgrades}
              domain={chart.isLoading ? undefined : domain}
              highlightedUpgradeId={props.highlightedUpgradeId}
              setHighlightedUpgradeId={props.setHighlightedUpgradeId}
              selectedUpgradeId={props.selectedUpgradeId}
              setSelectedUpgradeId={props.setSelectedUpgradeId}
            />
          }
        />
        <UpgradeNavigator {...props} />
      </div>
    </div>
  )
}

/**
 * Ethereum's cost and the L2s' as dots on one log scale, a row per measure,
 * the gap between them shaded and its multiple as the row's big number
 */
function CostTracks({ f }: { f: Figures }) {
  const rows = [
    {
      key: 'erc20',
      name: 'ERC-20 transfer',
      sub: f.erc20Date,
      times: f.timesCheaper,
      eth: f.erc20.ethereum,
      l2: f.erc20.l2s,
      l2Name: 'Median L2',
    },
    {
      key: 'avg',
      name: 'Average transaction',
      sub: f.period,
      times: f.avgRatio,
      eth: f.avgFee.ethereum,
      l2: f.avgFee.l2s,
      l2Name: 'L2s',
    },
  ]
  const values = rows.flatMap((r) => [r.eth, r.l2]).filter((v) => v > 0)
  const lo = Math.floor(Math.log10(Math.min(...values)))
  const hi = Math.ceil(Math.log10(Math.max(...values)))
  const decades = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
  const toX = (v: number) =>
    v > 0 ? Math.min(1, Math.max(0, (Math.log10(v) - lo) / (hi - lo))) * 100 : 0

  return (
    <div className="grid @xl:grid-cols-[180px_minmax(0,1fr)] grid-cols-1">
      {rows.map((row) => (
        <div
          key={row.key}
          className="col-span-full grid grid-cols-subgrid items-center gap-y-1 border-divider border-b py-3 first:pt-0"
        >
          <div className="flex @xl:flex-col items-baseline gap-x-3 @xl:gap-y-0.5">
            <span className="flex flex-col">
              <span className="font-bold text-base leading-tight">
                {row.name}
              </span>
              <span className="text-2xs text-secondary">{row.sub}</span>
            </span>
            <span className="@xl:ml-0 ml-auto flex items-baseline gap-1.5">
              <span
                className="font-bold text-2xl tabular-nums tracking-tight"
                style={{ color: KEY }}
              >
                {formatTimes(row.times)}
              </span>
              <span className="text-secondary text-xs">less on L2s</span>
            </span>
          </div>
          <Track
            decades={decades}
            toX={toX}
            l2={{ x: toX(row.l2), value: row.l2, name: row.l2Name }}
            eth={{ x: toX(row.eth), value: row.eth, name: 'Ethereum' }}
          />
        </div>
      ))}
      <div className="col-span-full grid grid-cols-subgrid pt-1.5 text-2xs text-secondary">
        <span className="max-@xl:hidden">USD, log scale</span>
        <div className="relative h-4">
          {decades.map((p) => (
            <span
              key={p}
              className={cn(
                'absolute tabular-nums',
                p === lo ? 'left-0' : p === hi ? 'right-0' : '-translate-x-1/2',
              )}
              style={
                p === lo || p === hi ? undefined : { left: `${toX(10 ** p)}%` }
              }
            >
              {formatFeeTick(10 ** p)}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TrackPoint {
  x: number
  value: number
  name: string
}

function Track({
  decades,
  toX,
  l2,
  eth,
}: {
  decades: number[]
  toX: (v: number) => number
  l2: TrackPoint
  eth: TrackPoint
}) {
  return (
    <div className="relative h-[60px]">
      {decades.map((p) => (
        <span
          key={p}
          className="absolute inset-y-0 border-divider border-l border-dashed opacity-70"
          style={{ left: `${toX(10 ** p)}%` }}
        />
      ))}
      <span className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-[3px] rounded-full bg-surface-tertiary opacity-60" />
      {/* The gap, from the L2s' cost up to Ethereum's */}
      <span
        className="-translate-y-1/2 absolute top-1/2 h-2.5 rounded-full"
        style={{
          left: `${l2.x}%`,
          width: `${eth.x - l2.x}%`,
          background: `linear-gradient(90deg, color-mix(in oklab, ${L2} 55%, transparent), color-mix(in oklab, ${ETH} 75%, transparent))`,
        }}
      />
      <Dot point={l2} color={L2} />
      <Dot point={eth} color={ETH} />
    </div>
  )
}

/** A dot on the track, its cost above it and its name under it */
function Dot({ point, color }: { point: TrackPoint; color: string }) {
  // Kept inside the track at either end
  const align =
    point.x < 6 ? 'left-0' : point.x > 94 ? 'right-0' : '-translate-x-1/2'
  const anchor =
    point.x < 6 || point.x > 94 ? undefined : { left: `${point.x}%` }
  return (
    <>
      <span
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 size-3.5 rounded-full ring-3 ring-surface-primary"
        style={{ left: `${point.x}%`, background: color }}
      />
      <span
        className={cn(
          'absolute top-0 whitespace-nowrap font-bold text-sm tabular-nums',
          align,
        )}
        style={anchor}
      >
        {formatFee(point.value)}
      </span>
      <span
        className={cn(
          'absolute bottom-0 whitespace-nowrap text-2xs text-secondary',
          align,
        )}
        style={anchor}
      >
        {point.name}
      </span>
    </>
  )
}

/** One line: the share paid in ETH, the split as a bar, its tokens keyed */
function PaidIn({ f }: { f: Figures }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="flex items-baseline gap-2 whitespace-nowrap">
        <Label>L2 fees paid in ETH</Label>
        <span className="font-bold text-base tabular-nums tracking-tight">
          {percent(f.ethShare)}
        </span>
      </span>
      <div className="flex h-2.5 min-w-24 flex-1 gap-[2px]">
        {f.l2s.feesByToken.map((t) => (
          <span
            key={t.token}
            className="min-w-[3px] first:rounded-l-full last:rounded-r-full"
            style={{
              width: `${f.l2s.fees > 0 ? (t.fees / f.l2s.fees) * 100 : 0}%`,
              background: tokenColor(t.token),
            }}
          />
        ))}
      </div>
      <Legend
        className="text-2xs"
        items={f.l2s.feesByToken.map((t) => ({
          key: t.token,
          label: `${t.token} ${usd(t.fees)}`,
          color: tokenColor(t.token),
          value: percent(f.l2s.fees > 0 ? t.fees / f.l2s.fees : 0),
        }))}
      />
    </div>
  )
}

/**
 * Under the plot: the upgrade hovered or picked on it, described, with
 * arrows to step through them all; the next upgrade when none is picked
 */
function UpgradeNavigator({
  upgrades,
  chart,
  setRange,
  highlightedUpgradeId,
  selectedUpgradeId,
  setSelectedUpgradeId,
}: MiddleCardProps) {
  const showWholeHistory = useCallback(
    () => setRange(optionToRange('max')),
    [setRange],
  )
  // Oldest first, so the arrows read left to right like the chart
  const dated = useMemo(
    () =>
      upgrades
        .filter((u) => u.timestamp !== null)
        .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0)),
    [upgrades],
  )
  const next = upgrades.find((u) => u.timestamp === null)
  const shown =
    upgrades.find((u) => u.id === highlightedUpgradeId) ??
    upgrades.find((u) => u.id === selectedUpgradeId) ??
    next
  const selectedIndex = dated.findIndex((u) => u.id === selectedUpgradeId)
  const outOfRange = dated.filter((u) => !isUpgradeInRange(u, chart.range))

  const step = (by: number) => {
    const from = selectedIndex === -1 ? dated.length : selectedIndex
    const to = dated[Math.min(dated.length - 1, Math.max(0, from + by))]
    if (!to) return
    setSelectedUpgradeId(to.id)
    if (!isUpgradeInRange(to, chart.range)) showWholeHistory()
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg bg-surface-secondary/60 px-3 py-2.5 md:flex-nowrap">
      <div className="flex shrink-0 items-center gap-1">
        <StepButton
          label="Earlier upgrade"
          disabled={selectedIndex === 0}
          onClick={() => step(-1)}
          direction="left"
        />
        <StepButton
          label="Later upgrade"
          disabled={selectedIndex === -1 || selectedIndex === dated.length - 1}
          onClick={() => step(1)}
          direction="right"
        />
      </div>
      <div className="min-w-0 flex-1 basis-60">
        {shown && <Described upgrade={shown} />}
      </div>
      {outOfRange.length > 0 && (
        <button
          type="button"
          onClick={showWholeHistory}
          className="shrink-0 whitespace-nowrap font-medium text-2xs text-secondary underline decoration-dotted underline-offset-2 hover:text-primary"
        >
          {outOfRange.length} earlier upgrades · show all
        </button>
      )}
    </div>
  )
}

function Described({ upgrade }: { upgrade: GasFeesUpgrade }) {
  return (
    <p className="text-xs leading-snug">
      <span
        className={cn(
          'mr-1.5 inline-block size-2 rounded-full align-[1px]',
          upgrade.kind === 'upgrade' && 'bg-brand',
          upgrade.kind === 'gasLimit' && 'border border-secondary',
          upgrade.kind === 'next' && 'border border-brand border-dashed',
        )}
      />
      <b className="text-sm">{upgrade.title}</b>
      <span className="mx-1.5 text-secondary">
        {upgrade.timestamp === null
          ? 'next, no date set yet'
          : formatTimestamp(upgrade.timestamp)}
      </span>
      <span className="text-secondary">{upgrade.summary}</span>
    </p>
  )
}

function StepButton({
  label,
  disabled,
  onClick,
  direction,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  direction: 'left' | 'right'
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-md bg-surface-primary text-primary shadow-xs hover:bg-surface-tertiary disabled:opacity-40"
    >
      <ChevronIcon
        className={cn(
          'size-3 fill-current',
          direction === 'left' ? 'rotate-90' : '-rotate-90',
        )}
      />
    </button>
  )
}
