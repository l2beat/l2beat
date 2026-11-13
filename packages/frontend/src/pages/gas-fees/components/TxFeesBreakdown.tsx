import { formatNumber } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'
import { ETH, L2, Label, percent, usd } from './parts'

/** Transactions and fees on each side, over the same period */
export interface TxFeesSplit {
  tx: { l2s: number; ethereum: number }
  fees: { l2s: number; ethereum: number }
}

interface Side {
  name: string
  color: string
  share: number
  value: string
}

/**
 * Transactions and fees as two upright 100% bars, L2s on top in both, joined
 * by a light band per side: L2s' large share of transactions narrows to a
 * small share of fees. The bands share one edge and never overlap.
 *
 * It fills its parent's height, so the parent sets how tall it is.
 */
export function TxFeesBreakdown({ split }: { split: TxFeesSplit }) {
  const txShare = share(split.tx.l2s, split.tx.ethereum)
  const feeShare = share(split.fees.l2s, split.fees.ethereum)
  const transactions: [Side, Side] = [
    {
      name: 'L2s',
      color: L2,
      share: txShare,
      value: `${formatNumber(split.tx.l2s, 1)} txs`,
    },
    {
      name: 'Ethereum',
      color: ETH,
      share: 1 - txShare,
      value: `${formatNumber(split.tx.ethereum, 1)} txs`,
    },
  ]
  const fees: [Side, Side] = [
    { name: 'L2s', color: L2, share: feeShare, value: usd(split.fees.l2s) },
    {
      name: 'Ethereum',
      color: ETH,
      share: 1 - feeShare,
      value: usd(split.fees.ethereum),
    },
  ]
  return (
    <div className="grid size-full grid-cols-[auto_32px_minmax(24px,1fr)_32px_auto] grid-rows-[auto_minmax(0,1fr)] gap-x-2 gap-y-3 md:grid-cols-[auto_44px_minmax(40px,1fr)_44px_auto] md:gap-x-3">
      <Label className="col-span-2 justify-self-end">Transactions</Label>
      <Label className="col-span-2 col-start-4 justify-self-start">Fees</Label>
      <SideValues sides={transactions} align="right" />
      <StackBar sides={transactions} />
      <FlowBands from={txShare} to={feeShare} />
      <StackBar sides={fees} />
      <SideValues sides={fees} align="left" />
    </div>
  )
}

function share(part: number, other: number) {
  return part + other > 0 ? part / (part + other) : 0
}

function StackBar({ sides }: { sides: [Side, Side] }) {
  return (
    <div className="flex flex-col gap-[3px] overflow-hidden rounded-lg">
      {sides.map((side) => (
        <span
          key={side.name}
          className="min-h-[3px] basis-0"
          style={{ flexGrow: side.share, backgroundColor: side.color }}
          title={`${side.name}: ${percent(side.share)} · ${side.value}`}
        />
      ))}
    </div>
  )
}

/** Each side's name and share, its amount under it, beside its segment */
function SideValues({
  sides,
  align,
}: {
  sides: [Side, Side]
  align: 'left' | 'right'
}) {
  return (
    <div className="flex flex-col gap-[3px] tabular-nums">
      {sides.map((side) => (
        <span
          key={side.name}
          className={cn(
            'flex min-h-0 basis-0 flex-col justify-center leading-tight',
            align === 'right' ? 'items-end text-right' : 'items-start',
          )}
          style={{ flexGrow: side.share }}
        >
          <span className="whitespace-nowrap font-bold text-sm md:text-base">
            {side.name} {percent(side.share)}
          </span>
          <span className="whitespace-nowrap text-2xs text-secondary">
            {side.value}
          </span>
        </span>
      ))}
    </div>
  )
}

/**
 * Each side's share of transactions flowing into its share of fees, in its
 * own color, split by one S-curve from where L2s end on the left to where
 * they end on the right
 */
function FlowBands({ from, to }: { from: number; to: number }) {
  const a = from * 100
  const b = to * 100
  return (
    <div className="relative">
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d={`M 0 0 L 100 0 L 100 ${b} C 50 ${b} 50 ${a} 0 ${a} Z`}
          fill={L2}
          fillOpacity={0.25}
        />
        <path
          d={`M 0 ${a} C 50 ${a} 50 ${b} 100 ${b} L 100 100 L 0 100 Z`}
          fill={ETH}
          fillOpacity={0.25}
        />
      </svg>
    </div>
  )
}
