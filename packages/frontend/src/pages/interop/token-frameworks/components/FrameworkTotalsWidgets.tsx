import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { cn } from '~/utils/cn'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useInteropSelectedChains } from '../../components/chain-selector/InteropSelectedChainsContext'
import { InteropTotalCard } from '../../components/InteropTotalCard'

export function TotalVolumeWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTotalCard
      title="Total volume"
      value={
        data ? formatCurrency(data.frameworkDominance.volume.total, 'usd') : ''
      }
      isLoading={isLoading}
      description="Across all frameworks"
      className={cn('lg:col-start-1 lg:row-span-2 lg:row-start-11', className)}
      mobile={mobile}
    />
  )
}

export function TotalTransfersWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTotalCard
      title="Total transfers"
      value={data ? formatInteger(data.frameworkDominance.transfers.total) : ''}
      isLoading={isLoading}
      description="Across all frameworks"
      className={cn('lg:col-start-2 lg:row-span-2 lg:row-start-11', className)}
      mobile={mobile}
    />
  )
}
