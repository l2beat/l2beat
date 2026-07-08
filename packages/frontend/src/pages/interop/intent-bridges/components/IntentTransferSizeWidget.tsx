import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { useChainSetSelection } from '../../components/chain-selector/ChainSetSelectionContext'
import { InteropTransferSizeCard } from '../../components/InteropTransferSizeCard'

export function IntentTransferSizeWidget() {
  const trpc = useTRPC()
  const { selectedChains } = useChainSetSelection()
  const { data, isLoading } = useQuery(
    trpc.interop.intentBridges.queryOptions({
      from: selectedChains,
      to: selectedChains,
    }),
  )

  return (
    <InteropTransferSizeCard
      data={data?.transferSizeChartData}
      isLoading={isLoading}
      className="h-75"
      categoryAxisWidth={130}
    />
  )
}
