import { cn } from '~/utils/cn'

/** A section that is not out yet, beside its name in the nav and its menus. */
export function SoonBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'shrink-0 rounded-sm bg-surface-secondary px-1.5 py-0.5 font-medium text-label-value-12 text-secondary leading-none',
        className,
      )}
    >
      Soon
    </span>
  )
}
