import { formatCurrency, UnixTime } from '@l2beat/shared-pure'
import type { GasFeesPeriod } from '~/server/features/gas-fees/getGasFeesTipping'
import { cn } from '~/utils/cn'
import { formatTimestamp } from '~/utils/dates'

export const ETH = 'var(--chart-ethereum)'
export const L2 = 'var(--chart-ethereum-secondary)'

/**
 * The Ethereum vs L2s section's two-column split, used by the stats and by
 * the chart with its upgrades, so the side column has the same width and its
 * divider sits at the same place in both. It needs an `@container` ancestor
 * as wide as the section.
 */
export const SPLIT = {
  grid: 'grid grid-cols-1 gap-6 @3xl:grid-cols-[minmax(0,1fr)_340px] @3xl:gap-0',
  main: 'min-w-0 @3xl:pr-8',
  side: 'border-divider @max-3xl:border-t @3xl:border-l',
  /** Inner padding of the side column, kept off `side` for absolute children */
  sidePad: '@max-3xl:pt-6 @3xl:pl-8',
}

export function Label({
  children,
  className,
  style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      style={style}
      className={cn(
        'font-semibold text-2xs text-primary uppercase tracking-wider',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function usd(value: number) {
  return formatCurrency(value, 'usd', { decimals: 1 })
}

/**
 * Whole percents from 10% to 99%, one decimal outside that, so 99.7% never
 * rounds up to a 100% that sits beside a 0.3%
 */
export function percent(share: number) {
  const pct = share * 100
  if (pct === 0 || pct === 100) return `${pct}%`
  if (pct < 0.1) return '<0.1%'
  if (pct > 99.9) return '>99.9%'
  return `${pct >= 10 && pct <= 99 ? Math.round(pct) : pct.toFixed(1)}%`
}

/** The days a figure covers, and how many of them are left out because Dune doesn't have them whole */
export function formatPeriod(period: GasFeesPeriod) {
  const days = `${formatTimestamp(period.from)} to ${formatTimestamp(period.to)}`
  if (period.missingDays === 0) return days
  return `${days}, without ${period.missingDays} ${period.missingDays === 1 ? 'day' : 'days'} of incomplete data`
}

/** In place of a figure the backend hasn't stored a day for yet */
export function NoDataYet() {
  return <p className="text-secondary text-sm">No data yet.</p>
}

/** A day is stored a few hours after it ends, so the newest is yesterday's or the day before's */
const USUAL_LAG_DAYS = 2

/** Says where the stored fees end, when that is further back than usual */
export function StoredUntil({ lastDay }: { lastDay: number | undefined }) {
  const expected =
    UnixTime.toStartOf(UnixTime.now(), 'day') - USUAL_LAG_DAYS * UnixTime.DAY
  if (lastDay === undefined || lastDay >= expected) return null
  return (
    <p className="font-medium text-sm text-warning">
      Fees are stored up to {formatTimestamp(lastDay)}.
    </p>
  )
}
