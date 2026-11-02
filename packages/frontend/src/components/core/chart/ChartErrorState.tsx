import { useState } from 'react'
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
  const { isRetrying, retry } = useRetry(onRetry)
  return (
    <ChartStateMessage
      size={size}
      icon={
        <RoundedWarningIcon className={cn('size-9', chartStateIconClassName)} />
      }
      title="Couldn't load chart"
      description="The request for this chart failed. Please try again."
      action={
        retry && (
          <button
            type="button"
            onClick={retry}
            disabled={isRetrying}
            className={cn(
              'h-8 rounded-lg px-3 font-medium text-xs transition-colors md:text-sm',
              'bg-surface-primary primary-card:bg-surface-secondary hover:bg-surface-tertiary primary-card:hover:bg-surface-tertiary',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
              'disabled:cursor-default disabled:opacity-50',
            )}
          >
            {isRetrying ? 'Retrying…' : 'Retry'}
          </button>
        )
      }
    />
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
