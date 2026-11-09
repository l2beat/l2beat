import type { ReactNode } from 'react'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { HOME_CHART_RANGE } from '../homeChartRanges'
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
}: {
  label: string
  /**
   * Secondary fact after the label, where the tiles sit side by side.
   * Opposite it, across the gutter, it would read as the next tile's.
   */
  labelAccessory?: ReactNode
  value: string | undefined
  /** Drawn smaller after the number, e.g. "TiB". */
  unit?: string
  /** Ratio over the chart's period, e.g. 0.12 for +12%. */
  change?: number
  chart: ReactNode
}) {
  const hasChange = change !== undefined && Number.isFinite(change)
  return (
    <div className="kpi-rows:col-span-2 grid min-w-0 grid-cols-1 kpi-rows:grid-cols-subgrid kpi-rows:items-center gap-y-4">
      {/* Positioned, so a stacked accessory can hang under it. */}
      <div className="relative flex min-w-0 flex-col">
        <span
          className={cn(
            'flex min-w-0 items-baseline gap-x-1.5',
            HOME_TEXT.meta,
          )}
        >
          <span className="truncate">{label}</span>
          {/* Beside a chart the label's column has no room to spare: there
              it hangs under the change, out of the flow, so this figure
              centres on the chart like the figures beside it. */}
          {labelAccessory && (
            <span className="flex kpi-rows:hidden shrink-0 gap-x-1.5 tabular-nums">
              <span aria-hidden>·</span>
              {labelAccessory}
            </span>
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
              <span className="text-secondary">{HOME_CHART_RANGE}</span>
            </span>
          )}
        </span>
        {labelAccessory && (
          <span
            className={cn(
              'kpi-rows:absolute kpi-rows:top-full kpi-rows:left-0 kpi-rows:mt-2 kpi-rows:block hidden tabular-nums',
              HOME_TEXT.meta,
            )}
          >
            {labelAccessory}
          </span>
        )}
      </div>
      {chart}
    </div>
  )
}
