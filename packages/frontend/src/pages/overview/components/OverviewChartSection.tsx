import type { ReactNode } from 'react'
import { cn } from '~/utils/cn'
import {
  OVERVIEW_CHART_PADDING_CLASS,
  OVERVIEW_CHART_RIGHT_INSET_CLASS,
} from './overviewChartHeight'

export function OverviewChartSection({
  label,
  periodLabel,
  stat,
  statFooter,
  children,
}: {
  label: string
  periodLabel: string
  stat?: ReactNode
  statFooter?: ReactNode
  children: ReactNode
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
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-w-0 flex-nowrap items-start justify-between gap-x-2">
        <span className="min-w-0 shrink font-medium text-label-value-12 text-secondary leading-tight">
          {label} {periodLabel}
        </span>
        <div className="min-w-0 shrink-0">{statsColumn}</div>
      </div>
      <div
        className={cn(
          'min-w-0',
          OVERVIEW_CHART_RIGHT_INSET_CLASS,
          OVERVIEW_CHART_PADDING_CLASS,
        )}
      >
        {children}
      </div>
    </div>
  )
}
