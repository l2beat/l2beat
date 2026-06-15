import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import {
  OVERVIEW_CHART_PADDING_CLASS,
  OVERVIEW_CHART_RIGHT_INSET_CLASS,
} from './overviewChartHeight'
import { OVERVIEW_CHART_SECTION_LABEL_CLASS } from './overviewResponsive'

export function OverviewChartSection({
  label,
  periodLabel,
  stat,
  statFooter,
  children,
  fill = false,
}: {
  label: string
  periodLabel: string
  stat?: ReactNode
  statFooter?: ReactNode
  children: ReactNode
  /** Grow to fill available height (xl single-column layout). */
  fill?: boolean
}) {
  const statsColumn =
    statFooter !== undefined && statFooter !== null ? (
      <div className="flex min-w-0 shrink-0 flex-col items-end gap-0.5 text-right">
        {stat}
        {statFooter}
      </div>
    ) : (
      stat
    )

  return (
    <div
      className={cn(
        'flex min-w-0 flex-col gap-2 min-[1536px]:gap-2.5 min-[1700px]:gap-3',
        fill && 'xl:h-full xl:min-h-0',
      )}
    >
      <div className="flex min-w-0 flex-nowrap items-start justify-between gap-x-2 min-[1536px]:gap-x-2.5">
        <span className={OVERVIEW_CHART_SECTION_LABEL_CLASS}>
          {label} {periodLabel}
        </span>
        <div className="min-w-0 shrink-0">{statsColumn}</div>
      </div>
      <div
        className={cn(
          'min-w-0',
          OVERVIEW_CHART_RIGHT_INSET_CLASS,
          OVERVIEW_CHART_PADDING_CLASS,
          fill && 'xl:flex xl:min-h-0 xl:flex-1 xl:flex-col',
        )}
      >
        {children}
      </div>
    </div>
  )
}
