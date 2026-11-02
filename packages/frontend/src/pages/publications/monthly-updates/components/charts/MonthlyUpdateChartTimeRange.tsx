import { Skeleton } from '~/components/core/Skeleton'
import { formatRange } from '~/utils/dates'

interface Props {
  timeRange: [number, number] | undefined
  /** The chart's request failed, so no range is coming: drop the skeleton. */
  isError?: boolean
}

export function MonthlyUpdateChartTimeRange({ timeRange, isError }: Props) {
  if (!timeRange) {
    if (isError) return null
    return <Skeleton className="my-[3px] h-[14px] w-44" />
  }

  return (
    <p className="whitespace-nowrap font-medium text-secondary text-xs">
      {formatRange(...timeRange)}
    </p>
  )
}
