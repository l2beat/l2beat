import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { TransferSizeChart } from '../../summary/components/charts/TransferSizeChart'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'
import { Last24HoursBadge } from './Last24HoursBadge'

export function FrameworkTransferSizeWidget() {
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

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
