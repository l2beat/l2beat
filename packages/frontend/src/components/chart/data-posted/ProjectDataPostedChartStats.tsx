import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { ScalingProjectDaThroughputChart } from '~/server/features/data-availability/throughput/getScalingProjectDaThroughtputChart'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { cn } from '~/utils/cn'
import { formatBytes } from '~/utils/number-format/formatBytes'
import { rangeToLabel } from '~/utils/project/rangeToLabel'

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
      <ChartStatsItem
        label="Avg size per L2 UOP"
        tooltip="The average posted data size of a L2 user operation for the selected time period."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.postedPerUop ? formatBytes(data.postedPerUop) : undefined}
      </ChartStatsItem>
    </ChartStats>
  )
}
