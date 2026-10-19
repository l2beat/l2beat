import type { ReactNode } from 'react'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { HOME_CHART_PERIOD_LABEL } from '../homeChartRanges'
import { HOME_TEXT } from '../homeStyles'
import { HomeChange } from './HomeChange'

/**
 * One headline figure with its change, e.g. "1.39 TiB +4.89% 1y", and a
 * sparkline underneath. Where a `HomeKpiRow` stacks its KPIs (`kpi-rows`),
 * the figure goes smaller, with the change under it, centered beside the
 * sparkline in the row's columns.
 */
export function HomeKpiTile({
  label,
  labelAccessory,
  value,
  unit,
  change,
  chart,
  className,
}: {
  label: string
  /** Secondary fact shown opposite the label. */
  labelAccessory?: ReactNode
  value: string | undefined
  /** Drawn smaller after the number, e.g. "TiB". */
  unit?: string
  /** Ratio over the chart's period, e.g. 0.12 for +12%. */
  change?: number
  chart: ReactNode
  className?: string
}) {
  const hasChange = change !== undefined && Number.isFinite(change)
  return (
    <div
      className={cn(
        'kpi-rows:col-span-2 grid min-w-0 grid-cols-1 kpi-rows:grid-cols-subgrid kpi-rows:items-center gap-y-4',
        className,
      )}
    >
      <div className="flex min-w-0 flex-col">
        {/* Beside a chart the label's column gives way to the chart on the
            narrowest phones; there the accessory wraps under the label
            instead of cutting it off. */}
        <span
          className={cn(
            'flex min-w-0 kpi-rows:flex-wrap items-baseline justify-between gap-x-2',
            HOME_TEXT.meta,
          )}
        >
          <span className="kpi-rows:shrink-0 truncate">{label}</span>
          {labelAccessory && (
            <span className="shrink-0 tabular-nums">{labelAccessory}</span>
          )}
        </span>
        <span className="mt-2 flex min-w-0 kpi-rows:flex-col kpi-rows:items-start items-baseline gap-x-2 gap-y-1 whitespace-nowrap">
          <span className="flex items-baseline gap-x-1.5">
            <span className={cn(HOME_TEXT.number, 'kpi-rows:text-heading-24')}>
              {value ?? EM_DASH}
            </span>
            {value !== undefined && unit && (
              <span className="font-medium kpi-rows:text-label-value-15 text-label-value-20 text-secondary">
                {unit}
              </span>
            )}
          </span>
          {value !== undefined && hasChange && (
            <span className="flex items-baseline gap-1 font-medium text-label-value-13">
              <HomeChange value={change} />
              <span className="text-secondary">{HOME_CHART_PERIOD_LABEL}</span>
            </span>
          )}
        </span>
      </div>
      {chart}
    </div>
  )
}
