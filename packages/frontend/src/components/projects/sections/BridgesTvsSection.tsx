import type { Milestone } from '@l2beat/config'
import type { ProjectToken } from '~/server/features/scaling/tvs/tokens/getTokensForProject'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { ProjectTvsChart } from '../../chart/tvs/ProjectTvsChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface BridgesTvsSectionProps extends ProjectSectionProps {
  id: 'tvs'
  tokens: ProjectToken[] | undefined
  projectId: string
  milestones: Milestone[]
  defaultRange: TvsChartRange
}

export function BridgesTvsSection({
  projectId,
  milestones,
  tokens,
  defaultRange,
  ...sectionProps
}: BridgesTvsSectionProps) {
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
