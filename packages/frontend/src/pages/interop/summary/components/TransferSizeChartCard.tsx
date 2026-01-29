import round from 'lodash/round'
import { useMemo } from 'react'
import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { TransferSizeChartData } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { TransferSizeChart } from './charts/TransferSizeChart'

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
        percentageUnder100: round((data.countUnder100 / total) * 100, 2),
        count100To1K: data.count100To1K,
        percentage100To1K: round((data.count100To1K / total) * 100, 2),
        count1KTo10K: data.count1KTo10K,
        percentage1KTo10K: round((data.count1KTo10K / total) * 100, 2),
        count10KTo100K: data.count10KTo100K,
        percentage10KTo100K: round((data.count10KTo100K / total) * 100, 2),
        countOver100K: data.countOver100K,
        percentageOver100K: round((data.countOver100K / total) * 100, 2),
      }
    })
  }, [transferSizeChartData])

  return (
    <PrimaryCard className="flex flex-col">
      <h2 className="font-bold text-heading-20 md:text-heading-24">
        Protocol transfer size
      </h2>

      <TransferSizeChart data={chartData} isLoading={isLoading} />
    </PrimaryCard>
  )
}
