import { PrimaryCard } from '~/components/primary-card/PrimaryCard'
import type { TransferSizeDataPoint } from '~/server/features/scaling/interop/utils/getTransferSizeChartData'
import { cn } from '~/utils/cn'
import { TransferSizeChart } from '../summary/components/charts/TransferSizeChart'
import { Last24HoursBadge } from './Last24HoursBadge'

export function InteropTransferSizeCard({
  data,
  isLoading,
  className,
  categoryAxisWidth,
}: {
  data: TransferSizeDataPoint[] | undefined
  isLoading: boolean
  className?: string
  categoryAxisWidth?: number
}) {
  return (
    <PrimaryCard
      className={cn('flex h-[230px] flex-col', className)}
      data-hide-overflow-x
    >
      <div className="flex items-center gap-2">
        <h2 className="font-bold text-heading-20">
          Transfer size distribution
        </h2>
        <Last24HoursBadge />
      </div>
      <div className="mt-2 min-h-0 flex-1">
        <TransferSizeChart
          data={data ?? []}
          isLoading={isLoading}
          horizontal
          categoryAxisWidth={categoryAxisWidth}
        />
      </div>
    </PrimaryCard>
  )
}
