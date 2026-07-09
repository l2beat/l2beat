import { InteropTransferSizeCard } from './InteropTransferSizeCard'
import { useInteropOverview } from './useInteropOverview'

export function InteropTransferSizeWidget({
  className,
  categoryAxisWidth,
}: {
  className?: string
  categoryAxisWidth?: number
}) {
  const { data, isLoading } = useInteropOverview()

  return (
    <InteropTransferSizeCard
      data={data?.transferSizeChartData}
      isLoading={isLoading}
      className={className}
      categoryAxisWidth={categoryAxisWidth}
    />
  )
}
