import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { TransferSizeDataPoint } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { TransferSizeChart } from './charts/TransferSizeChart'
import { TopNBadge } from './TopNBadge'

export function TransferSizeChartCard({
  transferSizeChartData,
  isLoading,
}: {
  transferSizeChartData: TransferSizeDataPoint[] | undefined
  isLoading: boolean
}) {
  return (
    <PrimaryCard className="flex flex-col border-transparent md:border-t-4">
      <div className="flex h-[34px] shrink-0 items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Protocol transfer size
        </h2>
        <TopNBadge n={15} />
      </div>

      <TransferSizeChart
        data={transferSizeChartData ?? []}
        isLoading={isLoading}
      />
    </PrimaryCard>
  )
}
