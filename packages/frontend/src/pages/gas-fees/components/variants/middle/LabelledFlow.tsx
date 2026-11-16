import { formatNumber } from '@l2beat/shared-pure'
import { useId, useRef } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { cn } from '~/utils/cn'
import { ETH, L2, Label, percent, usd } from '../../parts'
import type { Figures } from './shared'

/**
 * The transactions → fees flow with its names on the bars themselves, so
 * nothing hangs off its sides. A segment too small for its name keeps only
 * its colour, and its name sits just outside it.
 *
 * `FlowBands` lays the bars across, transactions over fees, the ribbon
 * running down between them. `FlowColumns` stands them up side by side.
 * Both fill their parent's height.
 */

interface Side {
  key: 'l2' | 'eth'
  name: string
  color: string
  share: number
  value: string
}

function getSides(f: Figures) {
  const transactions: [Side, Side] = [
    {
      key: 'l2',
      name: 'L2s',
      color: L2,
      share: f.txShare,
      value: `${formatNumber(f.l2s.txCount, 1)} txs`,
    },
    {
      key: 'eth',
      name: 'Ethereum',
      color: ETH,
      share: 1 - f.txShare,
      value: `${formatNumber(f.ethereum.txCount, 1)} txs`,
    },
  ]
  const fees: [Side, Side] = [
    {
      key: 'l2',
      name: 'L2s',
      color: L2,
      share: f.feeShare,
      value: usd(f.l2s.fees),
    },
    {
      key: 'eth',
      name: 'Ethereum',
      color: ETH,
      share: 1 - f.feeShare,
      value: usd(f.ethereum.fees),
    },
  ]
  return {
    transactions,
    fees,
    txTotal: formatNumber(f.l2s.txCount + f.ethereum.txCount, 1),
    feeTotal: usd(f.l2s.fees + f.ethereum.fees),
  }
}

/** Roughly how wide a line of Roboto is, for picking a label that fits */
function textWidth(text: string, size: number, bold = false) {
  return text.length * size * (bold ? 0.58 : 0.53)
}

/** The 3px gap between a bar's two segments */
const GAP = 3

/**
 * A segment's exact share of its bar, past the gap. Sized outright rather
 * than by flex-grow, which hands out only what is left after the labels'
 * padding and so drifts off the ribbon that meets it
 */
function share(value: number) {
  return `calc((100% - ${GAP}px) * ${value})`
}

// ---------------------------------------------------------------------------
// Across

type BandFit = 'full' | 'name' | 'outside'

function fitBand(side: Side, px: number | undefined): BandFit {
  if (px === undefined) return side.share > 0.2 ? 'name' : 'outside'
  const head = textWidth(`${side.name} ${percent(side.share)}`, 14, true)
  if (px >= head + textWidth(side.value, 12) + 8 + 28) return 'full'
  if (px >= head + 24) return 'name'
  return 'outside'
}

/**
 * Two thick bars across, transactions over fees, L2s on the left of both,
 * each segment named inside; the ribbon between shows the L2s' share
 * shrinking from one to the other
 */
export function FlowBands({
  f,
  className,
}: {
  f: Figures
  className?: string
}) {
  const { transactions, fees, txTotal, feeTotal } = getSides(f)
  const ref = useRef<HTMLDivElement>(null)
  const { width } = useResizeObserver({ ref })
  const px = (side: Side) =>
    width === undefined ? undefined : side.share * (width - GAP)
  const txFits = transactions.map((s) => fitBand(s, px(s)))
  const feeFits = fees.map((s) => fitBand(s, px(s)))

  return (
    <div className={cn('@container/flow', className)}>
      <div className="grid h-full @lg/flow:grid-cols-[auto_minmax(0,1fr)] grid-cols-1 grid-rows-[auto_auto_minmax(48px,1fr)_auto_auto] @lg/flow:gap-x-5 gap-y-1.5">
        <BandRow
          className="@lg/flow:col-start-2 row-start-1"
          rowLabel={<RowLabel name="Transactions" total={txTotal} />}
          sides={transactions}
          fits={txFits}
        />
        <RowLabel
          name="Transactions"
          total={txTotal}
          className="row-start-2 @lg/flow:flex hidden"
        />
        <div ref={ref} className="@lg/flow:col-start-2 row-start-2">
          <Band sides={transactions} fits={txFits} />
        </div>
        <BandRibbon
          from={f.txShare}
          to={f.feeShare}
          className="@lg/flow:col-start-2 row-start-3"
        />
        <RowLabel
          name="Fees"
          total={feeTotal}
          className="row-start-4 @lg/flow:flex hidden"
        />
        <div className="@lg/flow:col-start-2 row-start-4">
          <Band sides={fees} fits={feeFits} />
        </div>
        <BandRow
          className="@lg/flow:col-start-2 row-start-5"
          rowLabel={<RowLabel name="Fees" total={feeTotal} />}
          sides={fees}
          fits={feeFits}
        />
      </div>
    </div>
  )
}

function RowLabel({
  name,
  total,
  className,
}: {
  name: string
  total: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex flex-col justify-center gap-0.5 leading-none',
        className,
      )}
    >
      <Label>{name}</Label>
      <span className="font-bold text-sm tabular-nums">{total}</span>
    </span>
  )
}

/** A bar of two segments, each named inside when it has room */
function Band({ sides, fits }: { sides: [Side, Side]; fits: BandFit[] }) {
  return (
    <div className="flex h-11 md:h-12" style={{ gap: GAP }}>
      {sides.map((side, i) => (
        <span
          key={side.key}
          className="flex min-w-[3px] shrink-0 items-center overflow-hidden whitespace-nowrap px-3 text-white first:rounded-l-lg last:rounded-r-lg"
          style={{ width: share(side.share), background: side.color }}
          title={`${side.name}: ${percent(side.share)} · ${side.value}`}
        >
          {fits[i] !== 'outside' && (
            <span className="flex items-baseline gap-2 tabular-nums">
              <b className="text-sm">
                {side.name} {percent(side.share)}
              </b>
              {fits[i] === 'full' && (
                <span className="text-xs opacity-85">{side.value}</span>
              )}
            </span>
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * Above the transactions or under the fees: on narrow cards the row's own
 * label, and the name of any segment too small to hold it, at its end of
 * the bar
 */
function BandRow({
  sides,
  fits,
  rowLabel,
  className,
}: {
  sides: [Side, Side]
  fits: BandFit[]
  rowLabel: React.ReactNode
  className?: string
}) {
  const outside = sides.filter((_, i) => fits[i] === 'outside')
  return (
    <div
      className={cn(
        'flex items-end gap-3 @lg/flow:empty:hidden',
        outside.length === 0 && '@lg/flow:hidden',
        className,
      )}
    >
      <span className="@lg/flow:hidden">{rowLabel}</span>
      {outside.map((side) => (
        <span
          key={side.key}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap text-xs tabular-nums',
            side === sides[0]
              ? '@lg/flow:mr-auto @lg/flow:ml-0 ml-auto'
              : 'ml-auto',
          )}
        >
          <span
            className="size-2 shrink-0 rounded-xs"
            style={{ background: side.color }}
          />
          <b>
            {side.name} {percent(side.share)}
          </b>
          <span className="text-secondary">{side.value}</span>
        </span>
      ))}
    </div>
  )
}

/** The ribbon down from the transactions to the fees, split by one S-curve */
function BandRibbon({
  from,
  to,
  className,
}: {
  from: number
  to: number
  className?: string
}) {
  const a = from * 100
  const b = to * 100
  const curve = `M ${a} 0 C ${a} 50 ${b} 50 ${b} 100`
  const id = useId()
  return (
    <div className={cn('relative', className)}>
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-l2`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={L2} stopOpacity={0.42} />
            <stop offset="1" stopColor={L2} stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id={`${id}-eth`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={ETH} stopOpacity={0.16} />
            <stop offset="1" stopColor={ETH} stopOpacity={0.34} />
          </linearGradient>
        </defs>
        <path
          d={`M 0 0 L ${a} 0 C ${a} 50 ${b} 50 ${b} 100 L 0 100 Z`}
          fill={`url(#${id}-l2)`}
        />
        <path d={`${curve} L 100 100 L 100 0 Z`} fill={`url(#${id}-eth)`} />
        <path
          d={curve}
          fill="none"
          stroke="var(--surface-primary)"
          strokeWidth={GAP}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Upright

type ColumnFit = 'full' | 'pair' | 'line' | 'outside'

function fitColumn(
  side: Side,
  height: number | undefined,
  width: number | undefined,
): ColumnFit {
  if (height === undefined || width === undefined)
    return side.share > 0.3 ? 'full' : side.share > 0.1 ? 'line' : 'outside'
  const px = side.share * (height - GAP)
  const room = width - 24
  const head = `${side.name} ${percent(side.share)}`
  if (
    px >= 92 &&
    room >= textWidth(percent(side.share), 30, true) &&
    room >= textWidth(side.value, 12)
  )
    return 'full'
  if (px >= 46 && room >= textWidth(head, 14, true)) return 'pair'
  if (px >= 22 && room + 8 >= textWidth(head, 12, true)) return 'line'
  return 'outside'
}

/**
 * Two upright bars, transactions and fees, L2s on top in both, joined by a
 * ribbon per side; each segment carries its share in big type, its name and
 * its amount
 */
export function FlowColumns({
  f,
  className,
}: {
  f: Figures
  className?: string
}) {
  const { transactions, fees, txTotal, feeTotal } = getSides(f)
  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref })
  const txFits = transactions.map((s) => fitColumn(s, height, width))
  const feeFits = fees.map((s) => fitColumn(s, height, width))

  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,0.8fr)_minmax(40px,1.5fr)_minmax(0,0.8fr)] grid-rows-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-3',
        className,
      )}
    >
      <ColumnHead name="Transactions" total={txTotal} />
      <ColumnHead name="Fees" total={feeTotal} className="col-start-3" />
      <div ref={ref} className="min-h-0">
        <Column sides={transactions} fits={txFits} />
      </div>
      <ColumnRibbon
        from={f.txShare}
        to={f.feeShare}
        outside={[
          ...transactions.flatMap((side, i) =>
            txFits[i] === 'outside' ? [{ side, i, at: 'left' as const }] : [],
          ),
          ...fees.flatMap((side, i) =>
            feeFits[i] === 'outside' ? [{ side, i, at: 'right' as const }] : [],
          ),
        ]}
      />
      <Column sides={fees} fits={feeFits} />
    </div>
  )
}

function ColumnHead({
  name,
  total,
  className,
}: {
  name: string
  total: string
  className?: string
}) {
  return (
    <span
      className={cn(
        'flex @max-3xl:flex-col @max-3xl:items-start items-baseline justify-between gap-x-2 gap-y-0.5',
        className,
      )}
    >
      <Label>{name}</Label>
      <span className="whitespace-nowrap font-bold text-sm tabular-nums">
        {total}
      </span>
    </span>
  )
}

function Column({ sides, fits }: { sides: [Side, Side]; fits: ColumnFit[] }) {
  return (
    <div className="flex h-full flex-col" style={{ gap: GAP }}>
      {sides.map((side, i) => {
        const fit = fits[i]
        return (
          <span
            key={side.key}
            className={cn(
              'flex min-h-[3px] shrink-0 flex-col overflow-hidden whitespace-nowrap text-white tabular-nums first:rounded-t-xl last:rounded-b-xl',
              fit === 'full'
                ? 'justify-start p-3 md:p-4'
                : 'justify-center px-3',
            )}
            style={{ height: share(side.share), background: side.color }}
            title={`${side.name}: ${percent(side.share)} · ${side.value}`}
          >
            {fit === 'full' && (
              <>
                <span className="font-bold text-3xl leading-none tracking-tight md:text-4xl">
                  {percent(side.share)}
                </span>
                <span className="pt-1.5 font-semibold text-sm leading-tight">
                  {side.name}
                </span>
                <span className="text-xs leading-tight opacity-85">
                  {side.value}
                </span>
              </>
            )}
            {fit === 'pair' && (
              <>
                <b className="text-sm leading-tight md:text-base">
                  {side.name} {percent(side.share)}
                </b>
                <span className="text-xs leading-tight opacity-85">
                  {side.value}
                </span>
              </>
            )}
            {fit === 'line' && (
              <b className="text-xs leading-none">
                {side.name} {percent(side.share)}
              </b>
            )}
          </span>
        )
      })}
    </div>
  )
}

interface OutsideLabel {
  side: Side
  /** Top segment or bottom */
  i: number
  /** Beside the transactions bar or the fees bar */
  at: 'left' | 'right'
}

/**
 * Each side's share of transactions flowing into its share of fees, split
 * by one S-curve; a segment too thin to hold its name has it here, beside
 * the bar, on its own band
 */
function ColumnRibbon({
  from,
  to,
  outside,
}: {
  from: number
  to: number
  outside: OutsideLabel[]
}) {
  const a = from * 100
  const b = to * 100
  const curve = `M 0 ${a} C 50 ${a} 50 ${b} 100 ${b}`
  const id = useId()
  return (
    <div className="relative">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id={`${id}-l2`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={L2} stopOpacity={0.42} />
            <stop offset="1" stopColor={L2} stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id={`${id}-eth`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={ETH} stopOpacity={0.16} />
            <stop offset="1" stopColor={ETH} stopOpacity={0.34} />
          </linearGradient>
        </defs>
        <path
          d={`M 0 0 L 100 0 L 100 ${b} C 50 ${b} 50 ${a} 0 ${a} Z`}
          fill={`url(#${id}-l2)`}
        />
        <path d={`${curve} L 100 100 L 0 100 Z`} fill={`url(#${id}-eth)`} />
        <path
          d={curve}
          fill="none"
          stroke="var(--surface-primary)"
          strokeWidth={GAP}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {outside.map(({ side, i, at }) => {
        const share = at === 'left' ? from : to
        const center = i === 0 ? share / 2 : share + (1 - share) / 2
        return (
          <span
            key={`${at}-${side.key}`}
            className={cn(
              '-translate-y-1/2 absolute flex flex-col whitespace-nowrap rounded-md bg-surface-primary/85 px-1.5 py-0.5 text-2xs tabular-nums leading-tight shadow-xs',
              at === 'left' ? 'left-1 items-start' : 'right-1 items-end',
            )}
            style={{ top: `${center * 100}%` }}
          >
            <b className="text-xs">
              {side.name}{' '}
              <span style={{ color: side.color }}>{percent(side.share)}</span>
            </b>
            <span className="text-secondary">{side.value}</span>
          </span>
        )
      })}
    </div>
  )
}
