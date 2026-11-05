import { EmptyStateIcon } from '~/icons/EmptyState'
import { cn } from '~/utils/cn'

export function ChartNoDataState({ size }: { size: 'regular' | 'small' }) {
  return (
    <div className="absolute inset-0 z-30 flex select-none flex-col items-center justify-center gap-4 text-center duration-200 dark:from-neutral-900">
      <EmptyStateIcon
        className={cn(
          'fill-yellow-700 dark:fill-yellow-200',
          size === 'small' && 'hidden',
        )}
      />
      <span
        className={cn(
          'font-medium text-2xl text-yellow-700 leading-none dark:text-yellow-200',
          size === 'small' && 'text-xl',
        )}
      >
        No data
      </span>
      <span className={cn('text-sm', size === 'small' && 'hidden')}>
        There&apos;s no data for the project and the selected criteria. Please
        try again later.
      </span>
    </div>
  )
}
