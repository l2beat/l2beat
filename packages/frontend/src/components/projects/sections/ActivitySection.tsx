import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { ProjectActivityChart } from '../../chart/activity/ProjectActivityChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ActivitySectionProps extends ProjectSectionProps {
  id: 'activity'
  projectId: string
  milestones: Milestone[]
  category?: ProjectScalingCategory
  projectName?: string
}

export function ActivitySection({
  projectId,
  milestones,
  category,
  projectName,
  ...sectionProps
}: ActivitySectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectActivityChart
        milestones={milestones}
        projectId={projectId}
        category={category}
        projectName={projectName}
      />
    </ProjectSection>
  )
}
