import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { TvsChartRangeControls } from '~/components/chart/tvs/TvsChartRangeControls'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import {
  type ChartRange,
  type ChartResolution,
  rangeToResolution,
} from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { ProjectSectionProps } from '../types'

export interface TvsValueSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  milestones: Milestone[]
  rangeControls: 'tvs' | 'privacy'
  /** The value of the project's escrows on one chain, for projects tracked on several. */
  chain?: string
}

interface ChartData {
  data: { timestamp: number; value: number | null }[] | undefined
  syncedUntil: number | undefined
  isLoading: boolean
  isPlaceholderData: boolean
  resolution: ChartResolution
}

export function TvsValueSection({
  defaultRange,
  project,
  milestones,
  rangeControls,
  chain,
  ...projectSectionProps
}: TvsValueSectionProps) {
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const RangeControls =
    rangeControls === 'tvs'
      ? TvsChartRangeControls
      : PrivacyFlowsChartRangeControls

  const renderChart = (chart: ChartData) => {
    const timeRange = getChartTimeRangeFromData(chart.data)
    return (
      <ProjectSection {...projectSectionProps}>
        <ChartControlsWrapper className="mb-4">
          <ProjectChartTimeRange
            isPlaceholderData={chart.isPlaceholderData}
            timeRange={timeRange}
          />
          <RangeControls range={range} setRange={setRange} />
        </ChartControlsWrapper>
        <TvsValueChart
          isPlaceholderData={chart.isPlaceholderData}
          resolution={chart.resolution}
          data={chart.data}
          syncedUntil={chart.syncedUntil}
          isLoading={chart.isLoading}
          project={project}
          milestones={milestones}
        />
      </ProjectSection>
    )
  }

  return chain ? (
    <ChainValueChart project={project} chain={chain} range={range}>
      {renderChart}
    </ChainValueChart>
  ) : (
    <ProjectValueChart project={project} range={range}>
      {renderChart}
    </ProjectValueChart>
  )
}

function ProjectValueChart({
  project,
  range,
  children,
}: {
  project: ChartProject
  range: ChartRange
  children: (chart: ChartData) => React.ReactNode
}) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.tvs.chartByProjects,
    { projectIds: [project.id], range },
  )
  const chartData = useMemo(
    () =>
      data?.chart.map(([timestamp, valuesByProject]) => ({
        timestamp,
        value: valuesByProject[project.id] ?? null,
      })),
    [data, project.id],
  )
  return children({
    data: chartData,
    syncedUntil: data?.syncedUntil,
    isLoading,
    isPlaceholderData,
    resolution: rangeToResolution(shownInput.range),
  })
}

function ChainValueChart({
  project,
  chain,
  range,
  children,
}: {
  project: ChartProject
  chain: string
  range: ChartRange
  children: (chart: ChartData) => React.ReactNode
}) {
  const trpc = useTRPC()
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.tvs.chartByProjectChain,
    { projectId: project.id, chain, range },
  )
  const chartData = useMemo(
    () => data?.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data],
  )
  return children({
    data: chartData,
    syncedUntil: data?.syncedUntil,
    isLoading,
    isPlaceholderData,
    resolution: rangeToResolution(shownInput.range),
  })
}
