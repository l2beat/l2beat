import { EmptyStateIcon } from '~/icons/EmptyState'
import { cn } from '~/utils/cn'

export function ChartNoDataState({ size }: { size: 'regular' | 'small' }) {
  return (
    <div className="absolute inset-0 z-30 flex select-none flex-col items-center justify-center gap-4 text-center duration-200 dark:from-neutral-900">
      <EmptyStateIcon
        className={cn('fill-warning', size === 'small' && 'hidden')}
      />
      <span
        className={cn(
          'font-medium text-2xl text-warning-text leading-none',
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
