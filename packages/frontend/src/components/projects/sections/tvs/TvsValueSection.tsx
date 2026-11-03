import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/Chart'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface TvsValueSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  milestones: Milestone[]
  rangeControls: 'tvs' | 'privacy'
}

export function TvsValueSection({
  defaultRange,
  project,
  milestones,
  rangeControls,
  ...projectSectionProps
}: TvsValueSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading, isPlaceholderData } = useChartQuery(
    trpc.tvs.chartByProjects,
    {
      projectIds: [project.id],
      range,
    },
  )

  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => ({
        timestamp,
        value: valuesByProject[project.id] ?? null,
      })),
    [data, project.id],
  )

  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  const RangeControls =
    rangeControls === 'tvs'
      ? TvsChartRangeControls
      : PrivacyFlowsChartRangeControls

  return (
    <ProjectSection {...projectSectionProps}>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <RangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <TvsValueChart
        isPlaceholderData={isPlaceholderData}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
        milestones={milestones}
      />
    </ProjectSection>
  )
}
