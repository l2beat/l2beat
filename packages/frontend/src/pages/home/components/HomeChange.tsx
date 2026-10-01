import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'

/** A change as signed, coloured text, e.g. +12.0% or −3.1%; no arrows. */
export function HomeChange({
  value,
  className,
}: {
  /** Ratio, e.g. 0.12 for +12%. */
  value: number
  className?: string
}) {
  return (
    <span
      className={cn(
        'whitespace-nowrap tabular-nums',
        value > 0 && 'text-positive',
        value < 0 && 'text-negative',
        value === 0 && 'text-secondary',
        className,
      )}
    >
      {value > 0 ? '+' : value < 0 ? '−' : ''}
      {formatPercent(Math.abs(value))}
    </span>
  )
}
