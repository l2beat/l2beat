import { Skeleton } from '~/components/core/Skeleton'
import { formatRange } from '~/utils/dates'

interface Props {
  timeRange: [number, number] | undefined
  /**
   * The chart's request failed, so no range is coming. The skeleton gives way
   * to an empty slot of the same size, so nothing shifts when Retry brings the
   * skeleton back.
   */
  isError?: boolean
}

export function MonthlyUpdateChartTimeRange({ timeRange, isError }: Props) {
  if (!timeRange) {
    if (isError) return <div aria-hidden className="my-[3px] h-[14px]" />
    return <Skeleton className="my-[3px] h-[14px] w-44" />
  }

  return (
    <p className="whitespace-nowrap font-medium text-secondary text-xs">
      {formatRange(...timeRange)}
    </p>
  )
}
