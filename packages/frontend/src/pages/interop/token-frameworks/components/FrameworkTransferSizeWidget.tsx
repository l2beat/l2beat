import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { useChainSetSelection } from '../../components/chain-selector/ChainSetSelectionContext'
import { InteropTransferSizeCard } from '../../components/InteropTransferSizeCard'

export function FrameworkTransferSizeWidget() {
  const trpc = useTRPC()
  const { selectedChains } = useChainSetSelection()
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
