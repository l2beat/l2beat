import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DataPostedRangeControls } from '~/pages/scaling/data-posted/DataPostedRangeControls'
import { rangeToResolution } from '~/server/features/data-availability/throughput/utils/range'
import { api } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ChartControlsWrapper } from '../../core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '../../core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '../../core/chart/utils/getChartTimeRangeFromData'
import { DataPostedChart } from './DataPostedChart'
import { ProjectDataPostedChartStats } from './ProjectDataPostedChartStats'

interface Props {
  project: ChartProject
  defaultRange: ChartRange
  milestones: Milestone[]
}

export function ProjectDataPostedChart({
  project,
  defaultRange,
  milestones,
}: Props) {
  const [range, setRange] = useState<ChartRange>(defaultRange)

  const { data, isLoading } = api.da.scalingProjectChart.useQuery({
    range,
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

  const timeRange = getChartTimeRangeFromData(chartData)

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <DataPostedRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <DataPostedChart
        milestones={milestones}
        resolution={rangeToResolution(range)}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        className="mt-4"
        tickCount={4}
        project={project}
      />
      <HorizontalSeparator className="my-4" />
      <ProjectDataPostedChartStats data={data?.stats} isLoading={isLoading} />
    </div>
  )
}
