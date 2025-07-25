import { assertUnreachable } from '@l2beat/shared-pure'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { ScalingProjectDaThroughputChart } from '~/server/features/data-availability/throughput/getScalingProjectDaThroughtputChart'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { cn } from '~/utils/cn'
import { formatBytes } from '~/utils/number-format/formatBytes'

export function ProjectDataPostedChartStats({
  range,
  isLoading,
  data,
}: {
  range: DataPostedTimeRange
  isLoading: boolean
  data: ScalingProjectDaThroughputChart['stats'] | undefined
}) {
  return (
    <ChartStats className={cn('mt-4 lg:grid-cols-3')}>
      <ChartStatsItem
        label={`${rangeToLabel(range)} data posted`}
        tooltip="The total amount of data posted to project's respective Data Availability (DA) layer."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.total ? formatBytes(data.total) : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label="Avg size per day"
        tooltip="The average amount of data posted per day to project's respective Data Availability (DA) layer."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.avgPerDay ? formatBytes(data.avgPerDay) : undefined}
      </ChartStatsItem>
    </ChartStats>
  )
}

function rangeToLabel(range: DataPostedTimeRange) {
  switch (range) {
    case '1d':
      return 'Past day'
    case '7d':
      return '7 days'
    case '30d':
      return '30 days'
    case '90d':
      return '90 days'
    case '180d':
      return '180 days'
    case '1y':
      return '1 year'
    case 'max':
      return 'All time'
    default:
      assertUnreachable(range)
  }
}
