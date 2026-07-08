import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { useInteropSelectedChains } from '../../components/chain-selector/InteropSelectedChainsContext'
import { InteropTransferSizeCard } from '../../components/InteropTransferSizeCard'

export function FrameworkTransferSizeWidget() {
  const trpc = useTRPC()
  const { selectedChains } = useInteropSelectedChains()
  const { data, isLoading } = useQuery(
    trpc.interop.tokenFrameworks.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTransferSizeCard
      data={data?.transferSizeChartData}
      isLoading={isLoading}
    />
  )
}
