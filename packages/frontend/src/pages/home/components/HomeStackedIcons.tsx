import { cn } from '~/utils/cn'
import { HOME_ICON_CLASS, HOME_TEXT } from '../homeStyles'

/** Overlapping project icons, then how many more there are. */
export function HomeStackedIcons({
  items,
  max,
  showRest = true,
  className,
  iconClassName,
}: {
  items: { name: string; iconUrl: string }[]
  max: number
  /** Off where the count is already written out nearby. */
  showRest?: boolean
  className?: string
  /** Overrides the standard icon size, e.g. for a banner. */
  iconClassName?: string
}) {
  const visible = items.slice(0, max)
  const restCount = items.length - visible.length
  return (
    <span className={cn('flex shrink-0 items-center gap-1.5', className)}>
      <span className="-space-x-1.5 flex items-center">
        {visible.map((item, index) => (
          <img
            key={item.name}
            src={item.iconUrl}
            alt={item.name}
            title={item.name}
            className={cn(
              HOME_ICON_CLASS,
              'relative bg-surface-primary ring-2 ring-surface-primary',
              iconClassName,
            )}
            style={{ zIndex: visible.length - index }}
          />
        ))}
      </span>
      {showRest && restCount > 0 && (
        <span className={cn('tabular-nums', HOME_TEXT.meta)}>+{restCount}</span>
      )}
    </span>
  )
}
