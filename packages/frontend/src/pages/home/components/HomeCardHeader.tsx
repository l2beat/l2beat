import type { ReactNode } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { HOME_TEXT } from '../homeStyles'

/** Every card's and section's title row: title, then a subtitle. */
export function HomeCardHeader({
  title,
  subtitle,
  href,
  level = 2,
  className,
}: {
  title: string
  subtitle?: string
  /** Makes the title itself the link, with a chevron after it. */
  href?: string
  /** 3 for a block inside a card, under the card's own title. */
  level?: 2 | 3
  className?: string
}) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <div
      className={cn(
        'flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1',
        className,
      )}
    >
      <Heading
        className={cn(
          'shrink-0',
          level === 2 ? HOME_TEXT.title : HOME_TEXT.sectionTitle,
        )}
      >
        {href ? <HomeTitleLink href={href}>{title}</HomeTitleLink> : title}
      </Heading>
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
