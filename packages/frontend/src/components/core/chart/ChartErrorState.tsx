import { useState } from 'react'
import { RefreshIcon } from '~/icons/Refresh'
import { cn } from '~/utils/cn'

/**
 * Shown when the chart's request failed, as opposed to `ChartNoDataState`,
 * which means the request succeeded and there is nothing to plot. Kept quiet
 * on purpose: a failed request is usually transient, and Retry fixes it.
 */
export function ChartErrorState({
  size,
  onRetry,
}: {
  size: 'regular' | 'small'
  onRetry?: () => unknown
}) {
  const { isRetrying, retry } = useRetry(onRetry)
  return (
    <div
      role="alert"
      data-role="chart-error"
      className={cn(
        'absolute inset-1 z-30 flex select-none items-center justify-center rounded-lg border border-divider border-dashed text-center',
        size === 'regular' ? 'flex-col gap-3' : 'gap-2',
      )}
    >
      <div className="flex flex-col items-center gap-1.5">
        <span
          className={cn(
            'font-medium text-primary',
            size === 'regular' ? 'text-label-value-15' : 'text-label-value-13',
          )}
        >
          Couldn&apos;t load this chart
        </span>
        {size === 'regular' && (
          <span className="text-secondary text-xs">
            Something went wrong on our side.
          </span>
        )}
      </div>
      {retry && (
        <button
          type="button"
          onClick={retry}
          disabled={isRetrying}
          className={cn(
            'flex h-8 items-center gap-1.5 rounded-lg px-3 font-medium text-primary text-xs transition-colors md:text-sm',
            'bg-surface-primary primary-card:bg-surface-secondary hover:bg-surface-tertiary primary-card:hover:bg-surface-tertiary',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            'disabled:cursor-default disabled:text-secondary disabled:hover:bg-surface-primary primary-card:disabled:hover:bg-surface-secondary',
            size === 'small' && 'h-7 px-2',
          )}
        >
          <RefreshIcon
            className={cn('size-3.5', isRetrying && 'animate-spin')}
          />
          Try again
        </button>
      )}
    </div>
  )
}

/**
 * TanStack Query keeps `isError` true while it refetches a failed query, so
 * the button tracks its own pending retry to give feedback on the click.
 */
function useRetry(onRetry: (() => unknown) | undefined) {
  const [isRetrying, setIsRetrying] = useState(false)
  if (!onRetry) return { isRetrying, retry: undefined }

  const retry = async () => {
    setIsRetrying(true)
    try {
      await onRetry()
    } finally {
      setIsRetrying(false)
    }
  }
  return { isRetrying, retry }
}
