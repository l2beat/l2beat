import { Skeleton } from '~/components/core/Skeleton'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function TotalVolumeWidget() {
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

  return (
    <FrameworkTotalCard
      title="Total volume"
      value={
        data ? formatCurrency(data.frameworkDominance.volume.total, 'usd') : ''
      }
      isLoading={isLoading}
      className="col-start-1 row-start-6"
    />
  )
}

export function TotalTransfersWidget() {
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

  return (
    <FrameworkTotalCard
      title="Total transfers"
      value={data ? formatInteger(data.frameworkDominance.transfers.total) : ''}
      isLoading={isLoading}
      className="col-start-2 row-start-6"
    />
  )
}

function FrameworkTotalCard({
  title,
  value,
  isLoading,
  className,
}: {
  title: string
  value: string
  isLoading: boolean
  className?: string
}) {
  return (
    <PrimaryCard
      className={cn('flex h-28 flex-col gap-2 px-5! py-4!', className)}
    >
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-heading-18 leading-none">{title}</h3>
        <div className="rounded bg-n-blue-700 px-1.5 py-[3px] font-bold text-sm text-white leading-[1.15]">
          Last 24 hours
        </div>
      </div>
      {isLoading ? (
        <Skeleton className="h-8 w-32" />
      ) : (
        <span className="font-bold text-brand text-heading-24">{value}</span>
      )}
      <span className="font-medium text-label-value-15 text-secondary">
        Across all frameworks
      </span>
    </PrimaryCard>
  )
}
