import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import { api } from '~/trpc/React'
import { TransferSizeChart } from '../../summary/components/charts/TransferSizeChart'
import { useTokenFrameworksSelectedChains } from '../utils/TokenFrameworksSelectedChainsContext'

export function FrameworkTransferSizeWidget() {
  const { selectedChains } = useTokenFrameworksSelectedChains()
  const { data, isLoading } = api.interop.tokenFrameworks.useQuery({
    from: selectedChains,
    to: selectedChains,
  })

  return (
    <PrimaryCard className="flex h-[230px] flex-col">
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-heading-20">
          Transfer size distribution
        </h2>
        <div className="rounded bg-n-blue-700 px-1.5 py-[3px] font-bold text-sm text-white leading-[1.15]">
          Last 24 hours
        </div>
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
