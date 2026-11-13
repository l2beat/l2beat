import type { ReactNode } from 'react'
import { previousChartDataClassName } from '~/components/core/chart/ChartPreviousData'
import { Skeleton } from '~/components/core/Skeleton'
import { PercentChange } from '~/components/PercentChange'
import { cn } from '~/utils/cn'

interface Props {
  title: string
  /** Meta on the title's baseline, e.g. "Daily average". */
  subtitle?: ReactNode
  /** A text link opposite the title, named for what it opens. */
  link?: { href: string; label: string }
  /** Controls opposite the title, used when there is no link. */
  accessory?: ReactNode
  /** A line under the figure, or under the title when there is no figure. */
  meta?: ReactNode
  /** The headline figure, already formatted. */
  value?: string
  /** Drawn smaller after the figure, e.g. "UOPS". */
  unit?: string
  /** Meta after the figure, e.g. "past day". */
  valueLabel?: string
  /** Ratio over the chart's range, e.g. 0.12 for +12%. Hidden unless finite. */
  change?: number
  /** Written after the change, e.g. "1y". */
  rangeLabel?: string
  /** The figure is on its way: shows a skeleton while `value` is undefined. */
  isLoading?: boolean
  /** The figure is a previous query's, kept on screen while this one loads. */
  isPlaceholderData?: boolean
}

/**
 * The head of a chart card, in the home cards' type: a 20px title with a link
 * or controls opposite it, then the headline figure at 32px with its change
 * over the chart's range, e.g. "−30.1% 1y". Without a figure it is the title
 * and its meta line only.
 */
export function ChartCardHeader({
  title,
  subtitle,
  link,
  accessory,
  meta,
  value,
  unit,
  valueLabel,
  change,
  rangeLabel,
  isLoading,
  isPlaceholderData,
}: Props) {
  const hasFigure = value !== undefined || isLoading
  const heading = (
    <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
      {title}
    </h2>
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div
          className={cn(
            'flex min-w-0 flex-wrap justify-between gap-x-4 gap-y-2',
            accessory ? 'items-center' : 'items-baseline',
          )}
        >
          {subtitle ? (
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
              {heading}
              <span className="whitespace-nowrap font-normal text-label-value-13 text-secondary">
                {subtitle}
              </span>
            </div>
          ) : (
            heading
          )}
          {link ? (
            <a
              href={link.href}
              className="-my-1.5 shrink-0 whitespace-nowrap py-1.5 font-medium text-label-value-13 text-secondary underline decoration-divider underline-offset-[0.3em] transition-colors hover:text-primary hover:decoration-current"
            >
              {link.label}
            </a>
          ) : (
            accessory && (
              <div className="flex shrink-0 items-center gap-2">
                {accessory}
              </div>
            )
          )}
        </div>
        {!hasFigure && meta}
      </div>
      {hasFigure && (
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              'flex h-8 items-baseline gap-x-2 whitespace-nowrap',
              isPlaceholderData && previousChartDataClassName,
            )}
          >
            {value === undefined ? (
              <Skeleton className="h-7 w-40" />
            ) : (
              <>
                <span className="flex items-baseline gap-x-1.5">
                  <span className="font-semibold text-heading-32 tabular-nums leading-none tracking-[-0.025em]">
                    {value}
                  </span>
                  {unit && (
                    <span className="font-medium text-label-value-20 text-secondary">
                      {unit}
                    </span>
                  )}
                </span>
                {valueLabel && (
                  <span className="font-medium text-label-value-13 text-secondary">
                    {valueLabel}
                  </span>
                )}
                {change !== undefined && Number.isFinite(change) && (
                  <span className="flex items-baseline gap-1 font-medium text-label-value-13">
                    <PercentChange
                      value={change}
                      className="min-w-0 text-left text-label-value-13"
                    />
                    {rangeLabel && (
                      <span className="text-secondary">/ {rangeLabel}</span>
                    )}
                  </span>
                )}
              </>
            )}
          </div>
          {meta}
        </div>
      )}
    </div>
  )
}
