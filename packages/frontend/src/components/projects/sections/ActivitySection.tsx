import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { ProjectActivityChart } from '../../chart/activity/ProjectActivityChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ActivitySectionProps extends ProjectSectionProps {
  id: 'activity'
  projectId: string
  milestones: Milestone[]
  category?: ProjectScalingCategory
  projectName?: string
  defaultRange: ActivityTimeRange
}

export function ActivitySection({
  projectId,
  milestones,
  category,
  projectName,
  defaultRange,
  ...sectionProps
}: ActivitySectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectActivityChart
        milestones={milestones}
        projectId={projectId}
        category={category}
        projectName={projectName}
        defaultRange={defaultRange}
      />
    </ProjectSection>
  )
}
