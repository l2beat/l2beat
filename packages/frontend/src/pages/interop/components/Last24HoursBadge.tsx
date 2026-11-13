import { cn } from '~/utils/cn'

/**
 * The period beside a card title, as home and the Layer 2s pages show it:
 * 13px secondary text on the title's baseline. Put it in a `flex-wrap
 * items-baseline` row with the title so it drops under it when space runs out.
 */
export function Last24HoursBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'whitespace-nowrap font-normal text-label-value-13 text-secondary leading-4',
        className,
      )}
    >
      Last 24h
    </span>
  )
}
