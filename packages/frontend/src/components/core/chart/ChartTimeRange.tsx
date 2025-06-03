import { Skeleton } from '~/components/core/Skeleton'
import { formatRange } from '~/utils/dates'

interface Props {
  range: [number, number] | undefined
}

export function ChartTimeRange({ range }: Props) {
  if (!range) {
    return <Skeleton className="h-5 w-44 lg:h-6 lg:w-52" />
  }

  return (
    <p className="flex items-center font-medium text-secondary text-xs lg:text-base">
      {formatRange(...range)}
    </p>
  )
}

export function ProjectChartTimeRange({ range }: Props) {
  if (!range) {
    return <Skeleton className="h-8 w-44 lg:w-52" />
  }

  return (
    <p className="flex h-8 items-center font-bold">{formatRange(...range)}</p>
  )
}
