import type { ReactNode } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { HOME_TEXT } from '../homeStyles'

/** Every card's and section's title row: title, then a subtitle. */
export function HomeCardHeader({
  title,
  subtitle,
  href,
  className,
}: {
  title: string
  subtitle?: string
  /** Makes the title itself the link, with a chevron after it. */
  href?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1',
        className,
      )}
    >
      <h2 className={cn('shrink-0', HOME_TEXT.title)}>
        {href ? <HomeTitleLink href={href}>{title}</HomeTitleLink> : title}
      </h2>
      {subtitle && <span className={HOME_TEXT.meta}>{subtitle}</span>}
    </div>
  )
}

/** A title that leads somewhere: the title links, a chevron sized to it. */
export function HomeTitleLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  return (
    <a href={href} className="group inline-flex items-center gap-[0.35em]">
      <span className="underline-offset-4 group-hover:underline">
        {children}
      </span>
      <ChevronIcon className="-rotate-90 size-[0.55em] shrink-0 fill-current transition-transform group-hover:translate-x-0.5" />
    </a>
  )
}
