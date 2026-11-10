import type { Milestone } from '@l2beat/config'
import { useMemo, useState } from 'react'
import type { ChartProject } from '~/components/core/chart/ChartContext'
import { useChartQuery } from '~/components/core/chart/useChartQuery'
import { PrivacyFlowsChartRangeControls } from '~/pages/privacy/project/components/PrivacyFlowsChartRangeControls'
import { useTRPC } from '~/trpc/React'
import type { ChartRange } from '~/utils/range/range'
import { ProjectSection } from '../ProjectSection'
import type { SectionChain } from '../SectionChainBadge'
import { TvsValueSectionChart } from '../tvs/TvsValueSectionChart'
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

  return (
    <ProjectSection {...projectSectionProps} chain={chain}>
      <TvsValueSectionChart
        data={chartData}
        syncedUntil={data?.syncedUntil}
        isLoading={isLoading}
        isPlaceholderData={isPlaceholderData}
        shownRange={shownInput.range}
        rangeControls={
          <PrivacyFlowsChartRangeControls range={range} setRange={setRange} />
        }
        project={project}
        milestones={milestones}
      />
    </ProjectSection>
  )
}
