import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface DefiTvlSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
}

export function DefiTvlSection({
  defaultRange,
  project,
  ...projectSectionProps
}: DefiTvlSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading } = useQuery(
    trpc.defi.tvlChart.queryOptions({
      projectIds: [project.id],
      range,
    }),
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => ({
        timestamp,
        value: valuesByProject[project.id] ?? 0,
      })),
    [data, project.id],
  )

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <ProjectSection {...projectSectionProps}>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange timeRange={timeRange} />
        <TvsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <TvsValueChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
      />
    </ProjectSection>
  )
}
