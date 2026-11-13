import { Skeleton } from '~/components/core/Skeleton'
import { HomeCardHeader } from '~/pages/home/components/HomeCardHeader'
import { HomeChange } from '~/pages/home/components/HomeChange'
import { HOME_TEXT } from '~/pages/home/homeStyles'

/**
 * A summary chart's title and headline figure, in the home page's type
 * scale: the 20px title with its link opposite, then the 32px figure and its
 * change over the chart's period.
 */
export function L2SummaryChartHeader({
  title,
  link,
  value,
  unit,
  change,
  period,
}: {
  title: string
  link: { href: string; label: string }
  /** Undefined while loading. */
  value: string | undefined
  /** Drawn smaller after the number, e.g. "UOPS". */
  unit?: string
  /** Ratio over the period, e.g. 0.12 for +12%. */
  change: number | undefined
  /** Written after the change, e.g. "1y". */
  period: string
}) {
  const hasChange = change !== undefined && Number.isFinite(change)
  return (
    <div className="flex flex-col gap-3">
      <HomeCardHeader title={title} link={link} />
      {value === undefined ? (
        <Skeleton className="h-8 w-48" />
      ) : (
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1 whitespace-nowrap">
          <span className="flex items-baseline gap-x-1.5">
            <span className={HOME_TEXT.number}>{value}</span>
            {unit && (
              <span className="font-medium text-label-value-20 text-secondary">
                {unit}
              </span>
            )}
          </span>
          {hasChange && (
            <span className="flex items-baseline gap-1 font-medium text-label-value-13">
              <HomeChange value={change} />
              <span className="text-secondary">{period}</span>
            </span>
          )}
        </div>
      )}
    </div>
  )
}
