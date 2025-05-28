import type { Milestone } from '@l2beat/config'
import type { ProjectTokens } from 'rewrite/src/server/features/scaling/tvs/tokens/get-tokens-for-project'
import { ProjectTvsChart } from '../../chart/tvs/project-tvs-chart'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface TvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens?: ProjectTokens
  projectId: string
  milestones: Milestone[]
}

export function TvsSection({
  projectId,
  milestones,
  tokens,
  ...sectionProps
}: TvsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectTvsChart
        milestones={milestones}
        projectId={projectId}
        tokens={tokens}
      />
    </ProjectSection>
  )
}
