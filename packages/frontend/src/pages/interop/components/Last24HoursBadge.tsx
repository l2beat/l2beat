import { cn } from '~/utils/cn'

/**
 * The period beside a card title. Put it in a `flex-wrap items-baseline` row
 * with the title so it drops under it when space runs out.
 */
export function Last24HoursBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'whitespace-nowrap rounded bg-n-blue-700 px-1.5 py-[3px] font-medium text-label-value-12 text-white leading-none',
        className,
      )}
    >
      Last 24h
    </span>
  )
}
