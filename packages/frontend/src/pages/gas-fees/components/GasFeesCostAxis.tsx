import type { GasFeesSummaryRow } from '~/server/features/gas-fees/getGasFeesSummary'
import type { GasFeesPeriodMetric } from '~/server/features/gas-fees/types'
import { cn } from '~/utils/cn'

/** One log scale for every row's cost, so the chains line up under each other */
export interface CostAxis {
  /** Whole powers of ten on the axis, and where they sit (0–1) */
  ticks: { exponent: number; at: number }[]
  at: (cost: number) => number
  /** Where Ethereum's cost over the whole range sits, undefined when it has none */
  ethereumAt: number | undefined
  /** Where Ethereum's cost sits over the days it shares with the chain, which "cheaper" uses */
  sameDaysAt: (row: GasFeesSummaryRow) => number | undefined
  /** Some chain shares fewer days with Ethereum than the range has, so it has its own reference */
  hasOwnReferences: boolean
}

export function getCostAxis(
  rows: GasFeesSummaryRow[],
  action: GasFeesPeriodMetric,
): CostAxis {
  const logs = rows.flatMap((row) => {
    const cost = row[action]
    return cost !== null && cost > 0 ? [Math.log10(cost)] : []
  })
  let lo = logs.length > 0 ? Math.floor(Math.min(...logs)) : -4
  let hi = logs.length > 0 ? Math.ceil(Math.max(...logs)) : 0
  // One cost, on a power of ten
  if (hi === lo) {
    lo -= 0.5
    hi += 0.5
  }
  const at = (cost: number) =>
    Math.min(1, Math.max(0, (Math.log10(cost) - lo) / (hi - lo)))
  const ticks: CostAxis['ticks'] = []
  for (let e = Math.ceil(lo); e <= Math.floor(hi); e++) {
    ticks.push({ exponent: e, at: (e - lo) / (hi - lo) })
  }
  const ethereumCost = rows.find((row) => row.id === 'ethereum')?.[action]
  const sameDaysCost = (row: GasFeesSummaryRow) => {
    const cost = row[action]
    const times = row.timesCheaper?.[action]
    return cost && times ? cost * times : undefined
  }
  return {
    ticks,
    at,
    ethereumAt: ethereumCost ? at(ethereumCost) : undefined,
    sameDaysAt: (row) => {
      const cost = sameDaysCost(row)
      return cost === undefined ? undefined : at(cost)
    },
    hasOwnReferences:
      !!ethereumCost &&
      rows.some((row) => {
        const cost = sameDaysCost(row)
        return (
          cost !== undefined &&
          Math.abs(cost - ethereumCost) / ethereumCost > 0.05
        )
      }),
  }
}

const pct = (share: number) => `${share * 100}%`

/** Cheap is green and Ethereum's cost is yellow */
const CHEAP = 'var(--chart-emerald)'
const DEAR = 'var(--chart-stacked-yellow)'

/** The ticks, one every 10×, with Ethereum's line named above them */
export function CostAxisHead({ axis }: { axis: CostAxis }) {
  return (
    <div className="relative mx-3 h-12 flex-1 font-medium text-2xs normal-case">
      {axis.ethereumAt !== undefined && (
        <span
          className={cn(
            'absolute top-1 whitespace-nowrap',
            axis.ethereumAt > 0.85
              ? '-translate-x-full pr-1'
              : '-translate-x-1/2',
          )}
          style={{ left: pct(axis.ethereumAt) }}
        >
          Ethereum
        </span>
      )}
      {axis.ticks.map((tick) => (
        <span
          key={tick.exponent}
          className="-translate-x-1/2 absolute bottom-2 text-secondary tabular-nums"
          style={{ left: pct(tick.at) }}
        >
          {formatCostTick(tick.exponent)}
        </span>
      ))}
    </div>
  )
}

const compact = Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumSignificantDigits: 3,
})

/** "$1", "10¢", "1¢", "0.1¢": cents read faster than leading zeros */
function formatCostTick(exponent: number) {
  if (exponent >= 0) return `$${compact.format(10 ** exponent)}`
  return `${Number((10 ** (exponent + 2)).toPrecision(1))}¢`
}

/** A row's cost as a dot on the axis, over a rail that runs from cheap to Ethereum's cost */
export function CostAxisRow({
  axis,
  row,
  cost,
  isHighlighted,
  className,
}: {
  axis: CostAxis
  row: GasFeesSummaryRow
  cost: number | null
  isHighlighted: boolean
  className?: string
}) {
  const ethereumAt = axis.ethereumAt ?? 1
  const sameDaysAt = axis.sameDaysAt(row)
  const at = cost !== null && cost > 0 ? axis.at(cost) : undefined
  // A cost's colour from where it sits between the axis start and Ethereum, and yellow past it
  const dearness = ethereumAt > 0 ? Math.min(1, (at ?? 0) / ethereumAt) : 1
  return (
    <div className={cn('relative mx-3', className)}>
      {axis.ticks.map((tick) => (
        <span
          key={tick.exponent}
          className="absolute inset-y-0 w-px bg-divider opacity-60"
          style={{ left: pct(tick.at) }}
        />
      ))}
      <span
        className="-translate-y-1/2 absolute inset-x-0 top-1/2 h-1.5 rounded-full opacity-25"
        style={{
          background: `linear-gradient(90deg, ${CHEAP}, ${DEAR} ${pct(ethereumAt)}, ${DEAR})`,
        }}
      />
      {axis.ethereumAt !== undefined && (
        <span
          className="absolute inset-y-0 border-secondary/50 border-l border-dashed"
          style={{ left: pct(axis.ethereumAt) }}
        />
      )}
      {sameDaysAt !== undefined && Math.abs(sameDaysAt - ethereumAt) > 0.01 && (
        <span
          className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-3.5 w-0.5 rounded-full bg-secondary/70"
          style={{ left: pct(sameDaysAt) }}
        />
      )}
      {at !== undefined && (
        <span
          className={cn(
            '-translate-x-1/2 -translate-y-1/2 absolute top-1/2 rounded-full ring-2 ring-surface-primary transition-[width,height]',
            isHighlighted ? 'size-4' : 'size-3',
          )}
          style={{
            left: pct(at),
            background: `color-mix(in oklab, ${DEAR} ${Math.round(dearness * 100)}%, ${CHEAP})`,
          }}
        />
      )}
    </div>
  )
}

export function CostAxisKey({ axis }: { axis: CostAxis }) {
  return (
    <>
      <span className="flex items-center gap-1.5">
        Cheaper
        <span
          className="h-1.5 w-10 rounded-full"
          style={{ background: `linear-gradient(90deg, ${CHEAP}, ${DEAR})` }}
        />
        Ethereum’s cost
      </span>
      {axis.hasOwnReferences && (
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-0.5 rounded-full bg-secondary/70" />
          Ethereum over the days it shares with the chain
        </span>
      )}
    </>
  )
}
