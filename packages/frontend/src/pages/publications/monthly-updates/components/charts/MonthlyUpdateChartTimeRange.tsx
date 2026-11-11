import type { ChartTimeRangeValue } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { Skeleton } from '~/components/core/Skeleton'
import { formatRange } from '~/utils/dates'

interface Props {
  timeRange: ChartTimeRangeValue
}

export function MonthlyUpdateChartTimeRange({ timeRange }: Props) {
  if (!timeRange) {
    return <Skeleton className="my-[3px] h-[14px] w-44" />
  }

  return (
    <p className="whitespace-nowrap font-medium text-secondary text-xs">
      {formatRange(...timeRange)}
    </p>
  )
}
