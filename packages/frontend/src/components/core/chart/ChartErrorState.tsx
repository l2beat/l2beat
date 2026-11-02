import { RefreshIcon } from '~/icons/Refresh'
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
              'flex items-center gap-1.5 rounded-md border border-divider bg-surface-primary font-medium text-primary leading-none transition-colors',
              'primary-card:bg-surface-secondary hover:bg-surface-secondary primary-card:hover:bg-surface-tertiary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              size === 'regular' ? 'h-8 px-3 text-sm' : 'h-7 px-2.5 text-xs',
            )}
          >
            <RefreshIcon
              className={cn(
                'fill-secondary',
                size === 'regular' ? 'size-4' : 'size-3.5',
              )}
            />
            Try again
          </button>
        )
      }
    />
  )
}
