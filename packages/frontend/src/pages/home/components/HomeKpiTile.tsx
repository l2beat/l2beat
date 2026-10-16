import type { ReactNode } from 'react'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { HOME_CHART_PERIOD_LABEL } from '../homeChartRanges'
import { HOME_TEXT } from '../homeStyles'
import { HomeChange } from './HomeChange'

/**
 * One headline figure with its change, e.g. "1.39 TiB +4.89% 1y" (the change
 * under the figure in a narrow tile), and a sparkline underneath.
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
    // A container: in a tile under 220px the change moves under the figure
    // rather than being cut off. Both tiles of a pair are the same width, so
    // they switch together and their charts stay level.
    <div className={cn('@container flex min-w-0 flex-col', className)}>
      <span
        className={cn(
          'flex min-w-0 items-baseline justify-between gap-2',
          HOME_TEXT.meta,
        )}
      >
        <span className="truncate">{label}</span>
        {labelAccessory && (
          <span className="shrink-0 tabular-nums">{labelAccessory}</span>
        )}
      </span>
      <span className="mt-2 flex min-w-0 @max-[220px]:flex-col @max-[220px]:items-start items-baseline gap-x-2 gap-y-1 whitespace-nowrap">
        <span className="flex items-baseline gap-x-1.5">
          <span
            className={cn(
              HOME_TEXT.number,
              // Only for the narrowest phones; elsewhere the figure keeps
              // its size and the change makes way.
              '@max-[150px]:text-heading-24',
            )}
          >
            {value ?? EM_DASH}
          </span>
          {value !== undefined && unit && (
            <span className="font-medium text-label-value-20 text-secondary">
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
      <div className="mt-4 flex min-h-0 flex-1 flex-col">{chart}</div>
    </div>
  )
}
