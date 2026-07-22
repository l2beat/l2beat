import type { Milestone } from '@l2beat/config'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/Chart'
import { HorizontalSeparator } from '~/components/core/HorizontalSeparator'
import { DataPostedRangeControls } from '~/pages/layer2s/data-posted/DataPostedRangeControls'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
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
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)

  const { data, isLoading } = useQuery(
    trpc.da.layer2sProjectChart.queryOptions({
      range,
      projectId: project.id,
    }),
  )

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

  const resolution = rangeToResolution(range)
  const timeRange = getChartTimeRangeFromData(chartData, { bucket: resolution })

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange timeRange={timeRange} />
        <DataPostedRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <div className="mt-4">
        <DataPostedChart
          milestones={milestones}
          resolution={resolution}
          data={chartData}
          syncedUntil={data?.syncedUntil}
          isLoading={isLoading}
          tickCount={4}
          project={project}
        />
      </div>
      <HorizontalSeparator className="my-4" />
      <ProjectDataPostedChartStats data={data?.stats} isLoading={isLoading} />
    </div>
  )
}
