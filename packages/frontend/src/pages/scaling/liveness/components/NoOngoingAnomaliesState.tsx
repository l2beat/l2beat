import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { VerifiedIcon } from '~/icons/Verified'
import { cn } from '~/utils/cn'

export function NoOngoingAnomaliesState({ className }: { className?: string }) {
  return (
    <PrimaryCard
      className={cn(
        'flex items-center justify-center gap-1 border border-positive',
        className,
      )}
    >
      <VerifiedIcon className="size-5 fill-positive" />
      <span className="text-center font-medium text-positive leading-none">
        No ongoing anomalies detected
      </span>
    </PrimaryCard>
  )
}
