import type { ReactNode } from 'react'

/** Grid of chart sections inside the Scaling / Ethereum cards: side by side
 * from tablet up through the xl row layout, stacked and sharing the card's
 * height in the 2xl column layout. */
export const HOME_CHART_SECTION_GRID_CLASS =
  'grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 xl:min-h-0 xl:flex-1 2xl:auto-rows-fr 2xl:grid-cols-1 2xl:gap-5'

/**
 * Stat-tile-with-trend anatomy: muted label on the left, value with its change
 * stacked on the right, chart underneath.
 */
export function HomeChartSection({
  label,
  stat,
  statFooter,
  children,
}: {
  label: string
  stat?: ReactNode
  statFooter?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-w-0 flex-col xl:min-h-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1 pt-0.5">
          <span className="font-medium text-label-value-14">{label}</span>
          {statFooter}
        </div>
        <div className="flex-none">{stat}</div>
      </div>
      {/* mt-auto bottom-aligns charts in side-by-side sections, so their
          x-axes stay level when a header wraps to a second line. */}
      <div className="mt-auto w-full min-w-0 pt-3 xl:flex xl:min-h-0 xl:flex-1 xl:flex-col">
        {children}
      </div>
    </div>
  )
}
