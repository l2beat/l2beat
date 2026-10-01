import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
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
  className,
  children,
}: {
  title: string
  href: string
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
      <HomeCardHeader title={title} href={href} />
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

/** A titled block inside a domain card, e.g. its ranking. */
export function HomeDomainSection({
  title,
  className,
  children,
}: {
  title: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-2', className)}>
      <HomeCardHeader title={title} level={3} />
      {children}
    </div>
  )
}
