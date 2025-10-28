import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DataPostedTimeRangeControls } from '~/pages/scaling/data-posted/DataPostedTimeRangeControls'
import { rangeToResolution } from '~/server/features/scaling/costs/utils/range'
import type { DataPostedTimeRange } from '~/server/features/scaling/data-posted/range'
import { api } from '~/trpc/React'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartRange } from '../../core/chart/utils/getChartRangeFromColumns'
import { DataPostedChart } from './DataPostedChart'
import { ProjectDataPostedChartStats } from './ProjectDataPostedChartStats'

interface Props {
  project: ChartProject
  defaultRange: DataPostedTimeRange
  milestones: Milestone[]
}

export function ProjectDataPostedChart({
  project,
  defaultRange,
  milestones,
}: Props) {
  const [timeRange, setTimeRange] = useState<DataPostedTimeRange>(defaultRange)

  const { data, isLoading } = api.da.scalingProjectChart.useQuery({
    range: timeRange,
    projectId: project.id,
  })

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, ethereum, celestia, avail, eigenda]) => {
        return {
          timestamp,
          ethereum,
          celestia,
          avail,
          eigenda,
        }
      }),
    [data],
  )

  const chartRange = getChartRange(chartData)

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange range={chartRange} />
        <DataPostedTimeRangeControls
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          projectSection
        />
      </ChartControlsWrapper>
      <DataPostedChart
        milestones={milestones}
        resolution={rangeToResolution({ type: timeRange })}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        className="mt-4"
        tickCount={4}
        project={project}
      />
      <HorizontalSeparator className="my-4" />
      <ProjectDataPostedChartStats
        data={data?.stats}
        isLoading={isLoading}
        range={timeRange}
      />
    </div>
  )
}
