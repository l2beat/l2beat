import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { ChartStateMessage, chartStateIconClassName } from './ChartStateMessage'

/**
 * Shown when the chart's request failed, as opposed to `ChartNoDataState`,
 * which means the request succeeded and there is nothing to plot.
 */
export function ChartErrorState({
  size,
  onRetry,
}: {
  size: 'regular' | 'small'
  onRetry?: () => unknown
}) {
  return (
    <ChartStateMessage
      size={size}
      icon={
        <RoundedWarningIcon
          className={cn('size-9 max-md:size-7', chartStateIconClassName)}
        />
      }
      title="Couldn't load chart"
      description="Something went wrong on our end."
      action={
        onRetry && (
          <button
            type="button"
            // Retrying puts the chart back into its loading state, since a
            // query without data returns to pending when it refetches.
            onClick={() => onRetry()}
            className={cn(
              'font-medium transition-colors',
              // Sized like the chart's own controls: a RadioGroup and its items
              size === 'regular'
                ? 'h-8 rounded-lg px-3 text-xs md:text-sm'
                : 'h-6 rounded-md px-2 text-xs',
              'bg-surface-primary primary-card:bg-surface-secondary hover:bg-surface-tertiary primary-card:hover:bg-surface-tertiary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            )}
          >
            Retry
          </button>
        )
      }
    />
  )
}
