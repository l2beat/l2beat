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
  icon,
  link,
  className,
  children,
}: {
  title: string
  icon: ReactNode
  /**
   * Opposite the title, with the count, so the short ranking never reads as
   * everything we track.
   */
  link: { href: string; label: string }
  className?: string
  children: ReactNode
}) {
  return (
    // 20px between the parts, 24px above the ranking: it is a block of its
    // own, not a caption to the charts.
    <HomeCard
      className={cn(
        'row-span-3 grid min-w-0 grid-rows-subgrid gap-5 [&>:nth-child(3)]:mt-1',
        className,
      )}
    >
      <HomeCardHeader title={title} icon={icon} link={link} />
      {children}
    </HomeCard>
  )
}

/**
 * Two KPIs side by side, set apart by space alone; one under the other where
 * the side-by-side tiles would be too narrow (see `kpi-rows`), or as two
 * tiles in a column beside the rankings (`kpi-column`). As rows, the
 * two share their columns, so both charts start where the wider figure ends,
 * and at least 9.5rem in, wider than any 32px figure ("$999.99M"), so they
 * line up across the cards too.
 */
export function HomeKpiRow({ children }: { children: ReactNode }) {
  return (
    <div className="@container/kpis min-w-0">
      <div className="grid grid-cols-2 kpi-column:grid-cols-1 kpi-rows:grid-cols-[minmax(9.5rem,auto)_minmax(0,1fr)] gap-6 lg:gap-x-8">
        {children}
      </div>
    </div>
  )
}
