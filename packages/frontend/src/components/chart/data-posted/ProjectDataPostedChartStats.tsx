import { formatBytes } from '@l2beat/shared-pure'
import { ChartStats, ChartStatsItem } from '~/components/core/chart/ChartStats'
import type { L2ProjectDaThroughputChart } from '~/server/features/data-availability/throughput/getL2ProjectDaThroughtputChart'

export function ProjectDataPostedChartStats({
  isLoading,
  data,
}: {
  isLoading: boolean
  data: L2ProjectDaThroughputChart['stats'] | undefined
}) {
  return (
    <ChartStats className="lg:grid-cols-3">
      <ChartStatsItem
        label="Data posted"
        tooltip="The total amount of data posted to project's respective Data Availability (DA) layer(s)."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.total ? formatBytes(data.total) : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label="Avg size per day"
        tooltip="The average amount of data posted per day to project's respective Data Availability (DA) layer(s)."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.avgPerDay ? formatBytes(data.avgPerDay) : undefined}
      </ChartStatsItem>
      <ChartStatsItem
        label="Avg size per L2 UOP"
        tooltip="The average amount of data posted to the respective DA layer(s), divided by the number of user operations."
        isLoading={isLoading}
        className="max-md:h-7"
      >
        {data?.postedPerUop ? formatBytes(data.postedPerUop) : undefined}
      </ChartStatsItem>
    </ChartStats>
  )
}
