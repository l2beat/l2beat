import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { GasFeesSummaryRow } from '~/server/features/gas-fees/getGasFeesSummary'
import type { GasFeesUsdMetric } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'
import type { GasFeesChain } from '../../types'
import {
  FEE_SPLIT_COLORS,
  FEE_SPLIT_LABELS,
  getSplitParts,
  SPLIT_KEYS,
  SplitTooltipBody,
} from './shared'

/**
 * The pieces of B's shared log cost axis, for its spins (B itself keeps its
 * own copy, so it stays as the user saw it).
 */

export interface CostAxis {
  /** log10 of the axis ends */
  lo: number
  hi: number
  /** Whole powers of ten on the axis, and where they sit (0–1) */
  ticks: { exponent: number; at: number }[]
  at: (value: number) => number
  ethereum: GasFeesSummaryRow | undefined
  /** Where Ethereum's cost over the whole range sits */
  ethAt: number
  /** Ethereum over the days the chain was live, which "× cheaper" uses */
  sameDaysAt: (row: GasFeesSummaryRow) => number | undefined
  /** Some chain is younger than the range, so it has its own reference */
  hasYoung: boolean
}

/**
 * `pad` widens the axis past the values by that many decades, e.g. to leave
 * room for labels; without it the ends snap to whole powers of ten.
 */
export function getCostAxis(
  rows: GasFeesSummaryRow[],
  action: GasFeesUsdMetric,
  pad?: { lo: number; hi: number },
): CostAxis {
  const logs = rows
    .filter((r) => r[action] > 0)
    .map((r) => Math.log10(r[action]))
  const min = logs.length > 0 ? Math.min(...logs) : -4
  const max = logs.length > 0 ? Math.max(...logs) : 0
  let lo = pad ? min - pad.lo : Math.floor(min)
  let hi = pad ? max + pad.hi : Math.ceil(max)
  if (hi - lo < 1) {
    lo -= 0.5
    hi += 0.5
  }
  const at = (value: number) =>
    value > 0
      ? Math.min(1, Math.max(0, (Math.log10(value) - lo) / (hi - lo)))
      : 0
  const ticks: CostAxis['ticks'] = []
  for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) {
    ticks.push({ exponent: e, at: (e - lo) / (hi - lo) })
  }
  const ethereum = rows.find((r) => r.id === 'ethereum')
  const ethCost = ethereum?.[action]
  const sameDaysCost = (row: GasFeesSummaryRow) => {
    const times = row.timesCheaper?.[action]
    return times === undefined ? undefined : row[action] * times
  }
  return {
    lo,
    hi,
    ticks,
    at,
    ethereum,
    ethAt: ethCost ? at(ethCost) : 1,
    sameDaysAt: (row) => {
      const cost = sameDaysCost(row)
      return cost === undefined ? undefined : at(cost)
    },
    hasYoung:
      ethCost !== undefined &&
      rows.some((r) => {
        const cost = sameDaysCost(r)
        return cost !== undefined && Math.abs(cost - ethCost) / ethCost > 0.05
      }),
  }
}

export const pct = (v: number) => `${v * 100}%`

export function AxisGrid({
  ticks,
  className,
}: {
  ticks: CostAxis['ticks']
  className?: string
}) {
  return ticks.map((t) => (
    <span
      key={t.exponent}
      className={cn('absolute inset-y-0 w-px bg-divider', className)}
      style={{ left: pct(t.at) }}
    />
  ))
}

/**
 * Cheap is green, Ethereum's cost is yellow: a cost's colour from where it
 * sits between the axis start and Ethereum, and yellow past it
 */
const CHEAP = 'var(--chart-emerald)'
const DEAR = 'var(--chart-stacked-yellow)'
export const COST_GRADIENT = `linear-gradient(90deg, ${CHEAP}, ${DEAR})`
export const costColor = (at: number, ethAt: number) => {
  const share = ethAt > 0 ? Math.min(1, at / ethAt) : 1
  return `color-mix(in oklab, ${DEAR} ${Math.round(share * 100)}%, ${CHEAP})`
}

/** The whole axis as a faint green to yellow rail, behind each row's dot */
export function CostRail({ ethAt }: { ethAt: number }) {
  return (
    <span
      className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-1.5 rounded-full opacity-25"
      style={{
        background: `linear-gradient(90deg, ${CHEAP}, ${DEAR} ${ethAt * 100}%, ${DEAR})`,
      }}
    />
  )
}

/** Ethereum's cost, a dashed reference through every row */
export function EthLine({ at }: { at: number }) {
  return (
    <span
      className="absolute inset-y-0 border-secondary/50 border-l border-dashed"
      style={{ left: pct(at) }}
    />
  )
}

/** Where a younger chain's own Ethereum reference sits, if it's apart */
export function SameDaysTick({ at, ethAt }: { at: number; ethAt: number }) {
  if (Math.abs(at - ethAt) <= 0.01) return null
  return (
    <span
      className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-3.5 w-0.5 rounded-full bg-secondary/70"
      style={{ left: pct(at) }}
    />
  )
}

export function CostDot({
  at,
  ethAt,
  isHighlighted,
  className,
}: {
  at: number
  ethAt: number
  isHighlighted: boolean
  /** e.g. the ring's colour, to match a tinted background */
  className?: string
}) {
  return (
    <span
      className={cn(
        '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 rounded-full ring-2 ring-surface-primary transition-[width,height]',
        isHighlighted ? 'size-4' : 'size-3',
        className,
      )}
      style={{ left: pct(at), background: costColor(at, ethAt) }}
    />
  )
}

/** The split, with its shares written in where they fit */
export function LabelledSplit({
  row,
  chain,
  className,
  labels = true,
}: {
  row: GasFeesSummaryRow
  chain: GasFeesChain
  className?: string
  labels?: boolean
}) {
  const { parts, sum } = getSplitParts(row)
  return (
    <Tooltip>
      <TooltipTrigger className={cn('flex w-40 items-center py-3', className)}>
        <span
          className={cn(
            'flex w-full gap-px overflow-hidden rounded-[3px] bg-surface-secondary',
            labels ? 'h-4' : 'h-2',
          )}
        >
          {sum > 0 &&
            parts.map((p) => {
              const share = (p.value ?? 0) / sum
              if (share <= 0) return null
              return (
                <span
                  key={p.key}
                  className={cn(
                    'flex items-center justify-center overflow-hidden font-semibold text-[10px] tabular-nums leading-none',
                    FEE_SPLIT_COLORS[p.key],
                    p.key === 'base' ? 'text-white' : 'text-black/75',
                  )}
                  style={{ width: `${share * 100}%` }}
                >
                  {labels && share >= 0.17
                    ? `${Math.round(share * 100)}%`
                    : null}
                </span>
              )
            })}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <SplitTooltipBody row={row} chain={chain} />
      </TooltipContent>
    </Tooltip>
  )
}

export function AxisLegend({ hasYoung }: { hasYoung: boolean }) {
  return (
    <>
      <span className="flex items-center gap-1.5">
        Cheaper
        <span
          className="h-1.5 w-10 rounded-full"
          style={{ background: COST_GRADIENT }}
        />
        Ethereum's cost
      </span>
      {hasYoung && (
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-0.5 rounded-full bg-secondary/70" />
          Ethereum over a newer chain's days
        </span>
      )}
    </>
  )
}

export function SplitLegend() {
  return SPLIT_KEYS.map((key) => (
    <span key={key} className="flex items-center gap-1">
      <span className={cn('size-2 rounded-xs', FEE_SPLIT_COLORS[key])} />
      {FEE_SPLIT_LABELS[key]}
    </span>
  ))
}
