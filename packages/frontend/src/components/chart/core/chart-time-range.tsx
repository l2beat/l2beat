import { Skeleton } from '~/components/core/skeleton'
import { formatRange } from '~/utils/dates'
import { useChartLoading } from './chart-loading-context'

interface Props {
  range: [number, number] | undefined
  isLoading?: boolean
}

export function ChartTimeRange({ range, isLoading }: Props) {
  const loading = useChartLoading()
  if (loading || isLoading) {
    return <Skeleton className="h-5 w-44 lg:h-6 lg:w-52" />
  }

  return (
    <p className="flex items-center text-xs font-medium text-zinc-500 lg:text-base">
      {range ? formatRange(...range) : null}
    </p>
  )
}

export function ProjectChartTimeRange({ range }: Props) {
  const loading = useChartLoading()
  if (loading) {
    return <Skeleton className="h-8 w-44 lg:w-52" />
  }

  return (
    <p className="flex h-8 items-center font-bold">
      {range ? formatRange(...range) : null}
    </p>
  )
}
