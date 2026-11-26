import { formatNumber } from '@l2beat/shared-pure'
import { useId, useRef } from 'react'
import { useResizeObserver } from '~/hooks/useResizeObserver'
import { cn } from '~/utils/cn'
import { percent, usd } from './format'
import { ETH, L2, Label } from './parts'

interface Totals {
  txCount: number
  fees: number
}

interface Side {
  key: 'l2' | 'eth'
  name: string
  color: string
  share: number
  value: string
}

/** The gap between a bar's two segments, in pixels */
const GAP = 3

/**
 * Two upright bars, transactions and fees, with the L2s on top in both and a
 * ribbon between them: each side's share of transactions flowing into its
 * share of fees. Fills its parent's height.
 */
export function GasFeesFlow({
  txShare,
  feeShare,
  ethereum,
  l2s,
  className,
}: {
  /** The L2s' shares */
  txShare: number
  feeShare: number
  ethereum: Totals
  l2s: Totals
  className?: string
}) {
  const sides = (share: number, value: (totals: Totals) => string): Side[] => [
    { key: 'l2', name: 'L2s', color: L2, share, value: value(l2s) },
    {
      key: 'eth',
      name: 'Ethereum',
      color: ETH,
      share: 1 - share,
      value: value(ethereum),
    },
  ]
  const transactions = sides(
    txShare,
    (totals) => `${formatNumber(totals.txCount, 1)} txs`,
  )
  const fees = sides(feeShare, (totals) => usd(totals.fees))

  const ref = useRef<HTMLDivElement>(null)
  const { width, height } = useResizeObserver({ ref })
  const txFits = transactions.map((side) => fitLabel(side, height, width))
  const feeFits = fees.map((side) => fitLabel(side, height, width))
  const outside = (all: Side[], fits: Fit[], at: 'left' | 'right') =>
    all.flatMap((side, i) => (fits[i] === 'outside' ? [{ side, i, at }] : []))

  return (
    <div
      className={cn(
        'grid grid-cols-[minmax(0,0.8fr)_minmax(40px,1.5fr)_minmax(0,0.8fr)] grid-rows-[auto_minmax(0,1fr)] gap-x-1.5 gap-y-3',
        className,
      )}
    >
      <Head
        name="Transactions"
        total={formatNumber(l2s.txCount + ethereum.txCount, 1)}
      />
      <Head
        name="Fees"
        total={usd(l2s.fees + ethereum.fees)}
        className="col-start-3"
      />
      <div ref={ref} className="min-h-0">
        <Column sides={transactions} fits={txFits} />
      </div>
      <Ribbon
        from={txShare}
        to={feeShare}
        outside={[
          ...outside(transactions, txFits, 'left'),
          ...outside(fees, feeFits, 'right'),
        ]}
      />
      <Column sides={fees} fits={feeFits} />
    </div>
  )
}

/** How much of its label a segment has room for */
type Fit = 'full' | 'pair' | 'line' | 'outside'

/** Roughly how wide a line of the page's font is */
function textWidth(text: string, size: number) {
  return text.length * size * 0.58
}

function fitLabel(
  side: Side,
  height: number | undefined,
  width: number | undefined,
): Fit {
  // Before the bars are measured, on the server too
  if (height === undefined || width === undefined) {
    return side.share > 0.3 ? 'full' : side.share > 0.1 ? 'line' : 'outside'
  }
  const px = side.share * (height - GAP)
  const room = width - 24
  const head = `${side.name} ${percent(side.share)}`
  if (
    px >= 92 &&
    room >= textWidth(percent(side.share), 30) &&
    room >= textWidth(side.value, 12)
  ) {
    return 'full'
  }
  if (px >= 46 && room >= textWidth(head, 14)) return 'pair'
  if (px >= 22 && room + 8 >= textWidth(head, 12)) return 'line'
  return 'outside'
}

function Head({
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

function Column({ sides, fits }: { sides: Side[]; fits: Fit[] }) {
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
            style={{
              // Sized outright: flex-grow hands out only what the labels' padding leaves, and so drifts off the ribbon
              height: `calc((100% - ${GAP}px) * ${side.share})`,
              background: side.color,
            }}
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

/** The two bands, split by one S-curve. A segment too thin for its name has it here, beside its bar. */
function Ribbon({
  from,
  to,
  outside,
}: {
  from: number
  to: number
  outside: { side: Side; i: number; at: 'left' | 'right' }[]
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
              '-translate-y-1/2 absolute flex flex-col whitespace-nowrap rounded-md bg-surface-primary px-1.5 py-0.5 text-2xs tabular-nums leading-tight',
              at === 'left' ? 'left-1 items-start' : 'right-1 items-end',
            )}
            style={{ top: `${center * 100}%` }}
          >
            <b className="text-xs">
              {side.name} {percent(side.share)}
            </b>
            <span className="text-secondary">{side.value}</span>
          </span>
        )
      })}
    </div>
  )
}
