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
  const shown = formatPercent(Math.abs(value))
  // Sign and colour follow what is printed: a change that rounds to 0.00%
  // must not read as a gain or a loss.
  const sign = shown === formatPercent(0) ? 0 : Math.sign(value)
  return (
    <span
      className={cn(
        'whitespace-nowrap tabular-nums',
        sign > 0 && 'text-positive',
        sign < 0 && 'text-negative',
        sign === 0 && 'text-secondary',
        className,
      )}
    >
      {sign > 0 ? '+' : sign < 0 ? '−' : ''}
      {shown}
    </span>
  )
}
