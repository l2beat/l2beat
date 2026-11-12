import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import { previousChartDataClassName } from './ChartPreviousData'
import type { ChartTimeRangeValue } from './utils/getChartTimeRangeFromData'

interface Props {
  timeRange: ChartTimeRangeValue
  /** The range is a previous query's, kept on screen while this one loads. */
  isPlaceholderData: boolean
}

export function ChartTimeRange({ timeRange: range, isPlaceholderData }: Props) {
  if (range === undefined) {
    return <Skeleton className="h-5 w-44 lg:h-6 lg:w-52" />
  }
  // The chart below says there is no data; the line keeps its height.
  if (range === null) {
    return <div className="h-5 lg:h-6" />
  }

  return (
    <p
      className={cn(
        'flex items-center font-medium text-secondary text-xs lg:text-base',
        isPlaceholderData && previousChartDataClassName,
      )}
    >
      {formatRange(...range)}
    </p>
  )
}

export function ProjectChartTimeRange({
  timeRange: range,
  isPlaceholderData,
}: Props) {
  if (range === undefined) {
    return <Skeleton className="mb-1 h-7 w-44 lg:w-52" />
  }
  if (range === null) {
    return <div className="h-8" />
  }

  return (
    <p
      className={cn(
        'flex h-8 items-center font-medium text-label-value-15 text-secondary tabular-nums',
        isPlaceholderData && previousChartDataClassName,
      )}
    >
      {formatRange(...range)}
    </p>
  )
}
