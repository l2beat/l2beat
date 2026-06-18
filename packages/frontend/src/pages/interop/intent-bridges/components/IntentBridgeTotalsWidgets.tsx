import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { Last24HoursBadge } from '~/pages/interop/token-frameworks/components/Last24HoursBadge'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'

export function IntentTotalVolumeWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <IntentTotalCard
      title="Total volume"
      value={
        data ? formatCurrency(data.bridgeDominance.volume.total, 'usd') : ''
      }
      isLoading={isLoading}
      className={cn('lg:col-start-1 lg:row-span-2 lg:row-start-11', className)}
      mobile={mobile}
    />
  )
}

export function IntentTotalTransfersWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <IntentTotalCard
      title="Total transfers"
      value={data ? formatInteger(data.bridgeDominance.transfers.total) : ''}
      isLoading={isLoading}
      className={cn('lg:col-start-2 lg:row-span-2 lg:row-start-11', className)}
      mobile={mobile}
    />
  )
}

function IntentTotalCard({
  title,
  value,
  isLoading,
  className,
  mobile,
}: {
  title: string
  value: string
  isLoading: boolean
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
        Across intent bridges
      </span>
    </PrimaryCard>
  )
}
