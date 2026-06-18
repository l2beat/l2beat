import { useQuery } from '@tanstack/react-query'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { Last24HoursBadge } from '~/pages/interop/token-frameworks/components/Last24HoursBadge'
import { useTRPC } from '~/trpc/React'
import { TransferSizeChart } from '../../summary/components/charts/TransferSizeChart'
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
    <PrimaryCard className="flex h-[230px] flex-col" data-hide-overflow-x>
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-heading-20">
          Transfer size distribution
        </h2>
        <Last24HoursBadge />
      </div>
      <div className="min-h-0 flex-1">
        <TransferSizeChart
          data={data?.transferSizeChartData ?? []}
          isLoading={isLoading}
          horizontal
        />
      </div>
    </PrimaryCard>
  )
}
