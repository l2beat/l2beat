import { useMemo, useState } from 'react'
import { DataPostedTimeRangeControls } from '~/pages/scaling/data-posted/DataPostedTimeRangeControls'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { DataPostedChart } from './DataPostedChart'

interface Props {
  projectId: string
  defaultRange: DataPostedTimeRange
}

export function ProjectDataPostedChart({ projectId, defaultRange }: Props) {
  const [timeRange, setTimeRange] = useState<DataPostedTimeRange>(defaultRange)

  const { data, isLoading } = api.da.scalingProjectChart.useQuery({
    range: { type: timeRange },
    projectId,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, posted]) => {
        return {
          timestamp,
          posted,
        }
      }),
    [data?.chart],
  )

  const chartRange = getChartRange(chartData)

  return (
    <section className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <DataPostedTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          projectSection
        />
      </ChartControlsWrapper>
      <DataPostedChart
        data={chartData}
        isLoading={isLoading}
        syncedUntil={data?.syncedUntil}
        className="mt-4 mb-2"
        tickCount={4}
      />
    </section>
  )
}
