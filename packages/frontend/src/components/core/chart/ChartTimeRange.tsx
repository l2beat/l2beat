import { Skeleton } from '~/components/core/Skeleton'
import { cn } from '~/utils/cn'
import { formatRange } from '~/utils/dates'
import { LoadingBar } from '../LoadingBar'
import {
  previousChartDataClassName,
  useChartShowsPreviousData,
} from './ChartPreviousData'

interface Props {
  timeRange: [number, number] | undefined
}

export function ChartTimeRange({ timeRange }: Props) {
  if (!timeRange) {
    return <Skeleton className="h-5 w-44 lg:h-6 lg:w-52" />
  }

  return (
    <p className="relative flex w-fit items-center font-medium text-secondary text-xs lg:text-base">
      <ShownRange timeRange={timeRange} />
    </p>
  )
}

export function ProjectChartTimeRange({ timeRange }: Props) {
  if (!timeRange) {
    return <Skeleton className="mb-1 h-7 w-44 lg:w-52" />
  }

  return (
    <p className="relative flex h-8 w-fit items-center font-bold">
      <ShownRange timeRange={timeRange} />
    </p>
  )
}

/**
 * The range on screen. While it still belongs to the previous data, it dims
 * and a bar slides under it, one per request however many charts share it.
 */
function ShownRange({ timeRange }: { timeRange: [number, number] }) {
  const showsPreviousData = useChartShowsPreviousData()
  return (
    <>
      <span className={cn(showsPreviousData && previousChartDataClassName)}>
        {formatRange(...timeRange)}
      </span>
      {showsPreviousData && <LoadingBar className="top-auto bottom-0" />}
    </>
  )
}
