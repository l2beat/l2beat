import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { HOME_TEXT, HOME_UNDERLINE_CLASS } from '../homeStyles'

/**
 * Every card's title row: the title and a subtitle on the left, and where the
 * card leads, in words, opposite them. The title stays plain, so each card
 * has one link and one name for it.
 */
export function HomeCardHeader({
  title,
  subtitle,
  link,
  className,
}: {
  title: string
  subtitle?: ReactNode
  /** Named for what it opens, e.g. "All 14 projects". */
  link?: { href: string; label: string }
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 items-baseline justify-between gap-x-4',
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
        <h2 className={cn('shrink-0', HOME_TEXT.title)}>{title}</h2>
        {subtitle && <span className={HOME_TEXT.meta}>{subtitle}</span>}
      </div>
      {link && (
        <a
          href={link.href}
          className={cn(
            'shrink-0 whitespace-nowrap font-medium text-label-value-13 text-secondary hover:text-primary hover:decoration-current',
            HOME_UNDERLINE_CLASS,
          )}
        >
          {link.label}
        </a>
      )}
    </div>
  )
}
