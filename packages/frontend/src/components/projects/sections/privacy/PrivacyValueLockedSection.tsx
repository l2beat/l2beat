import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import { TvsValueChart } from '~/components/chart/tvs/TvsValueChart'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { ChartControlsWrapper } from '~/components/core/chart/ChartControlsWrapper'
import { ProjectChartTimeRange } from '~/components/core/chart/ChartTimeRange'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { getChartTimeRangeFromData } from '~/components/core/chart/utils/getChartTimeRangeFromData'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import { type ChartRange, rangeToResolution } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { SectionChain } from '../SectionChainBadge'
import type { ProjectSectionProps } from '../types'

export interface PrivacyValueLockedSectionProps extends ProjectSectionProps {
  defaultRange: ChartRange
  project: ChartProject
  milestones: Milestone[]
  /** The chain of the page, whose value the chart shows. */
  chain: SectionChain
}

/** Value locked on one chain of a project that has a page per tracked chain. */
export function PrivacyValueLockedSection({
  defaultRange,
  project,
  milestones,
  chain,
  ...projectSectionProps
}: PrivacyValueLockedSectionProps) {
  const trpc = useTRPC()
  const [range, setRange] = useState<ChartRange>(defaultRange)
  const { data, isLoading, isPlaceholderData, shownInput } = useChartQuery(
    trpc.privacy.valueLockedChart,
    { projectId: project.id, range, chain: chain.id },
  )

  const chartData = useMemo(
    () => data?.chart.map(([timestamp, value]) => ({ timestamp, value })),
    [data],
  )
  const timeRange = useMemo(
    () => getChartTimeRangeFromData(chartData),
    [chartData],
  )

  return (
    <ProjectSection {...projectSectionProps} chain={chain}>
      <ChartControlsWrapper className="mb-4">
        <ProjectChartTimeRange
          isPlaceholderData={isPlaceholderData}
          timeRange={timeRange}
        />
        <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
      </ChartControlsWrapper>
      <TvsValueChart
        isPlaceholderData={isPlaceholderData}
        resolution={rangeToResolution(shownInput.range)}
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        project={project}
        milestones={milestones}
      />
    </ProjectSection>
  )
}
