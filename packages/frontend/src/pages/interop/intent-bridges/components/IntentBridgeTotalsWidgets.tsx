import { useQuery } from '@tanstack/react-query'
import { InteropTotalCard } from '~/pages/interop/components/InteropTotalCard'
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
    <InteropTotalCard
      title="Total volume"
      value={
        data ? formatCurrency(data.bridgeDominance.volume.total, 'usd') : ''
      }
      isLoading={isLoading}
      description="Across intent bridges"
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
    <InteropTotalCard
      title="Total transfers"
      value={data ? formatInteger(data.bridgeDominance.transfers.total) : ''}
      isLoading={isLoading}
      description="Across intent bridges"
      className={cn('lg:col-start-2 lg:row-span-2 lg:row-start-11', className)}
      mobile={mobile}
    />
  )
}
