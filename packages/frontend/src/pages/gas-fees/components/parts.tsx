import { formatCurrency } from '@l2beat/shared-pure'
import { cn } from '~/utils/cn'

export const ETH = 'var(--chart-ethereum)'
export const L2 = 'var(--chart-ethereum-secondary)'
export const L1 = 'var(--chart-stacked-yellow)'

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
        'font-semibold text-2xs text-secondary uppercase tracking-wider',
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
