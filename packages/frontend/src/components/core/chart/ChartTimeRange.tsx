import { Skeleton } from '~/components/core/Skeleton'
import { formatRange } from '~/utils/dates'

interface Props {
  timeRange: [number, number] | undefined
  /** The chart's request failed, so no range is coming: drop the skeleton. */
  isError?: boolean
}

export function ChartTimeRange({ timeRange: range, isError }: Props) {
  if (!range) {
    if (isError) return null
    return <Skeleton className="h-5 w-44 lg:h-6 lg:w-52" />
  }

  return (
    <p className="flex items-center font-medium text-secondary text-xs lg:text-base">
      {formatRange(...range)}
    </p>
  )
}

export function ProjectChartTimeRange({ timeRange: range, isError }: Props) {
  if (!range) {
    if (isError) return null
    return <Skeleton className="mb-1 h-7 w-44 lg:w-52" />
  }

  return (
    <p className="flex h-8 items-center font-bold">{formatRange(...range)}</p>
  )
}
