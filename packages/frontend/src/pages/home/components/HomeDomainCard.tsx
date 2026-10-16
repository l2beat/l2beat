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
  link,
  className,
  children,
}: {
  title: string
  /**
   * Opposite the title, with the count, so the short ranking never reads as
   * everything we track.
   */
  link: { href: string; label: string }
  className?: string
  children: ReactNode
}) {
  return (
    <HomeCard
      className={cn(
        // 24px between the parts, 32px above the ranking: it is a block of
        // its own, not a caption to the charts.
        'row-span-3 grid min-w-0 grid-rows-subgrid gap-6 [&>:nth-child(3)]:mt-2',
        className,
      )}
    >
      <HomeCardHeader title={title} link={link} />
      {children}
    </HomeCard>
  )
}

/** Two KPIs side by side, set apart by space alone. */
export function HomeKpiRow({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-x-6 lg:gap-x-8', className)}>
      {children}
    </div>
  )
}
