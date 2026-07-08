import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { formatCurrency } from '~/utils/number-format/formatCurrency'
import { formatInteger } from '~/utils/number-format/formatInteger'
import { useInteropSelectedChains } from '../../components/chain-selector/InteropSelectedChainsContext'
import { InteropTotalCard } from '../../components/InteropTotalCard'

export function IntentTotalVolumeWidget({
  mobile,
  className,
}: {
  mobile?: boolean
  className?: string
}) {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTotalCard
      title="Total volume"
      value={data ? formatCurrency(data.activity.totalVolume, 'usd') : ''}
      isLoading={isLoading}
      description="Across all intent bridges"
      className={className}
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
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTotalCard
      title="Total transfers"
      value={data ? formatInteger(data.activity.totalTransferCount) : ''}
      isLoading={isLoading}
      description="Across all intent bridges"
      className={className}
      mobile={mobile}
    />
  )
}
