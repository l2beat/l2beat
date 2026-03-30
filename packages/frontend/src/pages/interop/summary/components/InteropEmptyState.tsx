import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { EmptyStateIcon } from '~/icons/EmptyState'
import { cn } from '~/utils/cn'

interface Props {
  showResetButton?: boolean
  onResetButtonClick?: () => void
  className?: string
}

export function InteropEmptyState({
  showResetButton,
  onResetButtonClick,
  className,
}: Props) {
  return (
    <PrimaryCard
      className={cn(
        'mt-5 flex w-full grow items-center justify-center',
        className,
      )}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <EmptyStateIcon className="size-9 fill-yellow-700 dark:fill-yellow-200" />
        <span className="mt-4 text-heading-24">
          No data for selected chains
        </span>
        <span className="mt-4 mb-6 font-medium text-label-value-16 text-secondary">
          We couldn&apos;t find data for this path. Select another route or
          adjust your filters.
        </span>
        {showResetButton && onResetButtonClick && (
          <button
            className="h-12 w-full max-w-[340px] rounded bg-brand font-semibold text-label-value-16 text-white"
            onClick={onResetButtonClick}
          >
            Reset selection to default
          </button>
        )}
      </div>
    </PrimaryCard>
  )
}
