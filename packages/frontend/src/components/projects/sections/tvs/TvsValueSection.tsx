import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'
import { TvsValueSectionChart } from './TvsValueSectionChart'

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
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
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

  const RangeControls =
    rangeControls === 'tvs'
      ? TvsChartRangeControls
      : PrivacyFlowsChartRangeControls

  return (
    <ProjectSection {...projectSectionProps}>
      <TvsValueSectionChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        shownRange={shownInput.range}
        rangeControls={<RangeControls range={range} setRange={setRange} />}
        project={project}
        milestones={milestones}
      />
    </ProjectSection>
  )
}
