import type { Milestone } from '@l2beat/config'
import type { ProjectTokens } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import { ProjectTvsChart } from '../../chart/tvs/ProjectTvsChart'
import { ProjectSection } from './ProjectSection'
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
