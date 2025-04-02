import type { Milestone, ProjectTvlInfo } from '@l2beat/config'
import { ProjectStackedTvsChart } from '~/components/chart/tvs/stacked/project-stacked-tvs-chart'
import type { ProjectTokens } from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import type { ProjectSevenDayTvsBreakdown } from '~/server/features/scaling/tvs/utils/get-7d-tvs-breakdown'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface StackedTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens?: ProjectTokens
  projectId: string
  milestones: Milestone[]
  tvsProjectStats: ProjectSevenDayTvsBreakdown
  tvlInfo: ProjectTvlInfo
  tvsBreakdownUrl?: string
}

export function StackedTvsSection({
  projectId,
  milestones,
  tokens,
  tvsProjectStats,
  tvlInfo,
  tvsBreakdownUrl,
  ...sectionProps
}: StackedTvsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectStackedTvsChart
        milestones={milestones}
        projectId={projectId}
        tokens={tokens}
        tvsProjectStats={tvsProjectStats}
        tvlInfo={tvlInfo}
        tvsBreakdownUrl={tvsBreakdownUrl}
      />
    </ProjectSection>
  )
}
