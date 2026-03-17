import { EmptyStateIcon } from '~/icons/EmptyState'
import { cn } from '~/utils/cn'

interface Props {
  className?: string
}

export function SelectedPathNoDataState({ className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        className,
      )}
    >
      <EmptyStateIcon className="mb-4 size-10 fill-yellow-700 dark:fill-yellow-200" />
      <span className="mb-2 font-bold text-heading-20">
        No data for the selected path
      </span>
      <span className="text-balance text-paragraph-14 text-secondary">
        We couldn&apos;t find data for this path. Select another route or adjust
        your filters.
      </span>
    </div>
  )
}
