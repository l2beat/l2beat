import type { ReactNode } from 'react'
import { EM_DASH } from '~/consts/characters'
import { cn } from '~/utils/cn'
import { HOME_CHART_PERIOD_LABEL } from '../homeChartRanges'
import { HOME_TEXT } from '../homeStyles'
import { HomeChange } from './HomeChange'

/**
 * One headline number on one line, e.g. "1.39 TiB +4.89% 1y", with a
 * sparkline underneath.
 */
export function HomeKpiTile({
  label,
  labelAccessory,
  value,
  unit,
  change,
  period = HOME_CHART_PERIOD_LABEL,
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
  /** The period the value or its change covers. */
  period?: string
  chart: ReactNode
  className?: string
}) {
  const hasChange = change !== undefined && Number.isFinite(change)
  return (
    // A container, so a narrow tile can step the number down and keep the
    // change on the same line; at its narrowest the period, the same for
    // every change on the page, gives way first.
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
      <span className="mt-1 flex min-w-0 items-baseline @max-[140px]:gap-x-1 gap-x-1.5 whitespace-nowrap">
        <span
          className={cn(
            HOME_TEXT.number,
            '@max-[140px]:text-heading-16 @max-[160px]:text-heading-18 @max-[220px]:text-heading-20',
          )}
        >
          {value ?? EM_DASH}
        </span>
        {value !== undefined && unit && (
          <span className="font-medium @max-[220px]:text-label-value-14 text-label-value-16 text-secondary">
            {unit}
          </span>
        )}
        {value !== undefined && (
          <span className="flex min-w-0 items-baseline gap-1 overflow-hidden @min-[160px]:pl-1 font-medium text-label-value-12">
            {hasChange && <HomeChange value={change} />}
            <span
              className={cn(
                'text-secondary',
                hasChange && '@max-[160px]:hidden',
              )}
            >
              {period}
            </span>
          </span>
        )}
      </span>
      <div className="mt-3 flex min-h-0 flex-1 flex-col">{chart}</div>
    </div>
  )
}
