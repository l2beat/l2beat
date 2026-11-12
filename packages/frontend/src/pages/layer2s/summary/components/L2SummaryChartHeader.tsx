import { Skeleton } from '~/components/core/Skeleton'
import { formatPercent } from '~/utils/calculatePercentageChange'
import { cn } from '~/utils/cn'

/**
 * The head of a Layer 2s summary chart card, in the home cards' type: a 20px
 * title with a text link to the full page opposite it, then the headline
 * figure at 32px with its change over the chart's range, e.g. "−30.1% 1y".
 */
export function L2SummaryChartHeader({
  title,
  link,
  value,
  unit,
  change,
  rangeLabel,
}: {
  title: string
  /** Named for what it opens. */
  link: { href: string; label: string }
  /** Undefined while loading. */
  value: string | undefined
  /** Drawn smaller after the figure, e.g. "UOPS". */
  unit?: string
  /** Ratio over the chart's range, e.g. 0.12 for +12%. */
  change: number | undefined
  rangeLabel: string
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex min-w-0 items-baseline justify-between gap-x-4">
        <h2 className="font-semibold text-heading-20 leading-6 tracking-[-0.01em]">
          {title}
        </h2>
        <a
          href={link.href}
          className="shrink-0 whitespace-nowrap font-medium text-label-value-13 text-secondary underline decoration-divider underline-offset-[0.3em] transition-colors hover:text-primary hover:decoration-current"
        >
          {link.label}
        </a>
      </div>
      <div className="flex h-8 items-baseline gap-x-2 whitespace-nowrap">
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
            {change !== undefined && Number.isFinite(change) && (
              <span className="flex items-baseline gap-1 font-medium text-label-value-13">
                <Change value={change} />
                <span className="text-secondary">{rangeLabel}</span>
              </span>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/** Signed and coloured, no arrows, as on the home cards. */
function Change({ value }: { value: number }) {
  return (
    <span
      className={cn(
        'tabular-nums',
        value > 0 && 'text-positive',
        value < 0 && 'text-negative',
        value === 0 && 'text-secondary',
      )}
    >
      {value > 0 ? '+' : value < 0 ? '−' : ''}
      {formatPercent(Math.abs(value))}
    </span>
  )
}
