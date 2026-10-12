import type { ReactNode } from 'react'
import { ChevronIcon } from '~/icons/Chevron'
import { cn } from '~/utils/cn'
import { HOME_TEXT } from '../homeStyles'
import { HomeCard } from './HomeCard'
import { HomeCardHeader } from './HomeCardHeader'

/**
 * The Layer 2s and Privacy cards. Each takes three rows of the parent grid
 * (header, KPIs, ranking), so the two cards keep every part level.
 * `children` must be exactly the KPI row and the ranking.
 */
export function HomeDomainCard({
  title,
  href,
  viewAll,
  className,
  children,
}: {
  title: string
  href: string
  /**
   * Opposite the title, so the short ranking never reads as everything we
   * track, at no cost in height.
   */
  viewAll: { href: string; label: string }
  className?: string
  children: ReactNode
}) {
  return (
    <HomeCard
      className={cn(
        'row-span-3 grid min-w-0 grid-rows-subgrid gap-5',
        className,
      )}
    >
      <div className="flex min-w-0 items-baseline justify-between gap-3">
        <HomeCardHeader title={title} href={href} />
        <a
          href={viewAll.href}
          className={cn(
            'group flex min-w-0 items-center gap-1 hover:text-primary',
            HOME_TEXT.meta,
          )}
        >
          <span className="truncate underline-offset-2 group-hover:underline">
            {viewAll.label}
          </span>
          <ChevronIcon className="-rotate-90 size-2 shrink-0 fill-current transition-transform group-hover:translate-x-0.5" />
        </a>
      </div>
      {children}
    </HomeCard>
  )
}

/** Two KPIs side by side with a hairline between them. */
export function HomeKpiRow({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 divide-x divide-divider',
        '*:px-4 *:first:pl-0 *:last:pr-0',
        className,
      )}
    >
      {children}
    </div>
  )
}
