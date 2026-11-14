import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { cn } from '~/utils/cn'
import { Last24HoursBadge } from './Last24HoursBadge'

export function InteropTotalCard({
  title,
  value,
  isLoading,
  description,
  className,
  mobile,
}: {
  title: string
  value: string
  isLoading: boolean
  description: string
  className?: string
  mobile?: boolean
}) {
  return (
    <PrimaryCard
      className={cn(
        'flex flex-col gap-2',
        mobile && 'rounded-lg! bg-surface-secondary! p-4!',
        className,
      )}
    >
      {/* Stacked in the narrow phone tiles, so both figures share a line
          whether or not the period would wrap */}
      <div
        className={cn(
          'flex',
          mobile ? 'flex-col' : 'flex-wrap items-baseline gap-x-2',
        )}
      >
        <h3 className="font-medium text-label-value-13 md:text-label-value-15">
          {title}
        </h3>
        <Last24HoursBadge />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <span
          className={cn(
            'font-semibold text-heading-20 tabular-nums leading-none tracking-[-0.025em] md:text-heading-32',
            !mobile && 'text-brand-deep',
          )}
        >
          {value}
        </span>
      )}
      <span className="font-normal text-label-value-13 text-secondary">
        {description}
      </span>
    </PrimaryCard>
  )
}
