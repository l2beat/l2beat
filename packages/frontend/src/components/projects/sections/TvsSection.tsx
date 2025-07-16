import type { Milestone } from '@l2beat/config'
import type { ProjectTokens } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ProjectTvsChart } from '../../chart/tvs/ProjectTvsChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface TvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens?: ProjectTokens
  projectId: string
  milestones: Milestone[]
  defaultRange: TvsChartRange
}

export function TvsSection({
  projectId,
  milestones,
  tokens,
  defaultRange,
  ...sectionProps
}: TvsSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectTvsChart
        milestones={milestones}
        projectId={projectId}
        tokens={tokens}
        defaultRange={defaultRange}
      />
    </ProjectSection>
  )
}
