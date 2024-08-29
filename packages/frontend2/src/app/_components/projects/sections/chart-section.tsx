import { type Milestone } from '@l2beat/config'
import { ProjectActivityChart } from '../../chart/activity/project-activity-chart'
import { ProjectCostsChart } from '../../chart/costs/project-costs-chart'
import { ProjectSection } from './project-section'
import { type ProjectSectionId, type ProjectSectionProps } from './types'

type ChartSectionId = Extract<
  ProjectSectionId,
  'onchain-costs' | 'tvl' | 'activity'
>

export interface ChartSectionProps extends ProjectSectionProps {
  id: ChartSectionId
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
      <ProjectChart
        id={sectionProps.id}
        milestones={milestones}
        projectId={projectId}
      />
    </ProjectSection>
  )
}

interface ProjectChartProps {
  id: ChartSectionId
  projectId: string
  milestones: Milestone[]
}

function ProjectChart({ id, projectId, milestones }: ProjectChartProps) {
  switch (id) {
    case 'tvl':
      throw new Error('Not implemented')
    case 'activity':
      return (
        <ProjectActivityChart milestones={milestones} projectId={projectId} />
      )
    case 'onchain-costs':
      return <ProjectCostsChart milestones={milestones} projectId={projectId} />
  }
}
