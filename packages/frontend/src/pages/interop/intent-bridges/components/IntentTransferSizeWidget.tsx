import { useQuery } from '@tanstack/react-query'
import { useTRPC } from '~/trpc/React'
import { InteropTransferSizeCard } from '../../components/InteropTransferSizeCard'
import { useIntentBridgesSelectedChains } from '../utils/IntentBridgesSelectedChainsContext'

export function IntentTransferSizeWidget() {
  const trpc = useTRPC()
  const { selectedChains } = useIntentBridgesSelectedChains()
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
