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
        'flex flex-col gap-2 px-5! py-4!',
        mobile && 'rounded-lg! bg-surface-secondary! p-4!',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-medium text-[11px] leading-[1.15] max-md:text-secondary max-md:uppercase md:font-bold md:text-heading-18 md:leading-none">
          {title}
        </h3>
        <Last24HoursBadge className="max-md:hidden" />
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <span
          className={cn(
            'font-bold text-heading-20 md:text-heading-24',
            mobile ? 'text-primary' : 'text-brand',
          )}
        >
          {value}
        </span>
      )}
      <span className="font-medium text-label-value-15 text-secondary">
        {description}
      </span>
    </PrimaryCard>
  )
}
