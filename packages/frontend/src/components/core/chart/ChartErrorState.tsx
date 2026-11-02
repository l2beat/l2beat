import { useState } from 'react'
import { RoundedWarningIcon } from '~/icons/RoundedWarning'
import { cn } from '~/utils/cn'
import { Button } from '../Button'

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
    <div
      role="alert"
      data-role="chart-error"
      className="absolute inset-0 z-30 flex select-none flex-col items-center justify-center gap-3 text-center"
    >
      <RoundedWarningIcon
        sentiment="bad"
        className={cn('size-8', size === 'small' && 'hidden')}
      />
      <span
        className={cn(
          'font-medium text-2xl text-primary leading-none',
          size === 'small' && 'text-lg',
        )}
      >
        Couldn&apos;t load chart
      </span>
      <span
        className={cn('text-secondary text-sm', size === 'small' && 'hidden')}
      >
        The request for this chart failed.
      </span>
      {retry && (
        <Button
          variant="outline"
          size="sm"
          className="px-4"
          disabled={isRetrying}
          onClick={retry}
        >
          {isRetrying ? 'Retrying…' : 'Retry'}
        </Button>
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
