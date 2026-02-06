import { round } from 'es-toolkit/compat'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { TransferSizeChartData } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { TransferSizeChart } from './charts/TransferSizeChart'
import { TopNBadge } from './TopNBadge'

export function TransferSizeChartCard({
  transferSizeChartData,
  isLoading,
}: {
  transferSizeChartData: TransferSizeChartData | undefined
  isLoading: boolean
}) {
  const chartData = useMemo(() => {
    return Object.values(transferSizeChartData ?? {}).map((data) => {
      const total =
        data.countUnder100 +
        data.count100To1K +
        data.count1KTo10K +
        data.count10KTo100K +
        data.countOver100K

      return {
        name: data.name,
        iconUrl: data.iconUrl,
        countUnder100: data.countUnder100,
        percentageUnder100:
          total > 0 ? round((data.countUnder100 / total) * 100, 2) : 0,
        count100To1K: data.count100To1K,
        percentage100To1K:
          total > 0 ? round((data.count100To1K / total) * 100, 2) : 0,
        count1KTo10K: data.count1KTo10K,
        percentage1KTo10K:
          total > 0 ? round((data.count1KTo10K / total) * 100, 2) : 0,
        count10KTo100K: data.count10KTo100K,
        percentage10KTo100K:
          total > 0 ? round((data.count10KTo100K / total) * 100, 2) : 0,
        countOver100K: data.countOver100K,
        percentageOver100K:
          total > 0 ? round((data.countOver100K / total) * 100, 2) : 0,
      }
    })
  }, [transferSizeChartData])

  return (
    <PrimaryCard className="flex flex-col border-transparent md:border-t-4">
      <div className="flex h-[34px] shrink-0 items-center gap-2">
        <h2 className="font-bold text-heading-20 md:text-heading-24">
          Protocol transfer size
        </h2>
        <TopNBadge n={15} />
      </div>

      <TransferSizeChart data={chartData} isLoading={isLoading} />
    </PrimaryCard>
  )
}
