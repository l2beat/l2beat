import type { ReactNode } from 'react'

export const HOME_CHART_SECTION_GRID_CLASS =
  'grid grid-cols-1 gap-5 lg:min-h-0 lg:flex-1 lg:auto-rows-fr'

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
    <div className="flex h-full min-w-0 flex-col lg:min-h-0">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1 pt-0.5">
          <span className="font-medium text-label-value-14">{label}</span>
          {statFooter}
        </div>
        <div className="flex-none">{stat}</div>
      </div>
      <div className="mt-auto w-full min-w-0 pt-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
        {children}
      </div>
    </div>
  )
}
