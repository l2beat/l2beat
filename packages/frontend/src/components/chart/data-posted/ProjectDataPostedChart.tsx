import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartPreviousDataDim } from '~/components/core/chart/ChartPreviousData'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
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

  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.da.l2ProjectChart,
    { range, projectId: project.id },
  )

  const chartData = useMemo(
    () => data?.chart.map(([timestamp, ethereum]) => ({ timestamp, ethereum })),
    [data],
  )

  const resolution = rangeToResolution(shownInput.range)
  const timeRange = getChartTimeRangeFromData(chartData, { bucket: resolution })

  return (
    <div className="flex flex-col">
      <ChartControlsWrapper>
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <DataPostedRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <div className="mt-4">
        <DataPostedChart
          isPlaceholderData={isPlaceholderData}
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
      <ChartPreviousDataDim isPlaceholderData={isPlaceholderData}>
        <ProjectDataPostedChartStats data={data?.stats} isLoading={isLoading} />
      </ChartPreviousDataDim>
    </div>
  )
}
