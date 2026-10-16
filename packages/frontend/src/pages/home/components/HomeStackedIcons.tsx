import { cn } from '~/utils/cn'
import { HOME_ICON_CLASS } from '../homeStyles'

/**
 * Overlapping project icons, the first `max` of them. Always beside a count
 * that says what they are, so the icons themselves are decorative; hover
 * names each one.
 */
export function HomeStackedIcons({
  items,
  max,
}: {
  items: { name: string; iconUrl: string }[]
  max: number
}) {
  const visible = items.slice(0, max)
  return (
    <span className="-space-x-1.5 flex shrink-0 items-center">
      {visible.map((item, index) => (
        <img
          key={item.name}
          src={item.iconUrl}
          alt=""
          title={item.name}
          className={cn(
            HOME_ICON_CLASS,
            'relative bg-surface-primary ring-2 ring-surface-primary',
          )}
          style={{ zIndex: visible.length - index }}
        />
      ))}
    </span>
  )
}
