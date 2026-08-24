import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { VerifiedIcon } from '~/icons/Verified'
import { cn } from '~/utils/cn'

export function NoAnomaliesState({
  type,
  className,
}: {
  type: 'recent' | 'ongoing'
  className?: string
}) {
  return (
    <PrimaryCard
      className={cn(
        'flex items-center justify-center gap-1 border border-positive',
        className,
      )}
    >
      <VerifiedIcon className="size-5 fill-positive" />
      <span className="text-center font-bold text-label-value-14 text-positive md:text-label-value-15">
        No {type} anomalies detected
      </span>
    </PrimaryCard>
  )
}
