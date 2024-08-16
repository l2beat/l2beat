import { type Milestone } from '@l2beat/config'
import { ProjectSection } from './project-section'
import { type ProjectSectionId, type ProjectSectionProps } from './types'
import { ProjectCostsChart } from '../../chart/costs/project-costs-chart'

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
    case 'activity':
      throw new Error('Not implemented')
    case 'onchain-costs':
      return <ProjectCostsChart milestones={milestones} projectId={projectId} />
  }
}
