import { type Milestone } from '@l2beat/config'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'
import { ProjectCostsChart } from '../../chart/costs/project-costs-chart'

export interface ChartSectionProps extends ProjectSectionProps {
  projectId: string
  milestones: Milestone[]
}

export function ChartSection({
  projectId,
  milestones,
  ...sectionProps
}: ChartSectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      <ProjectCostsChart milestones={milestones} projectId={projectId} />
    </ProjectSection>
  )
}
