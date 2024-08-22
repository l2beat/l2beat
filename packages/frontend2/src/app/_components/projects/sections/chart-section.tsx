import { type Milestone } from '@l2beat/config'
import { ProjectCostsChart } from '../../chart/costs/project-costs-chart'
import { ProjectTvlChart } from '../../chart/tvl/project-tvl-chart'
import { ProjectStackedTvlChart } from '../../chart/tvl/stacked/project-stacked-tvl-chart'
import { ProjectSection } from './project-section'
import { type ProjectSectionId, type ProjectSectionProps } from './types'

type ChartSectionId = Extract<
  ProjectSectionId,
  'onchain-costs' | 'tvl' | 'activity'
>

export interface ChartSectionProps extends ProjectSectionProps {
  id: ChartSectionId
  stacked?: boolean
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
        projectId={projectId}
        milestones={milestones}
        {...sectionProps}
      />
    </ProjectSection>
  )
}

function ProjectChart(props: ChartSectionProps) {
  switch (props.id) {
    case 'tvl':
      if (props.stacked) {
        return (
          <ProjectStackedTvlChart
            milestones={props.milestones}
            projectId={props.projectId}
          />
        )
      }
      return (
        <ProjectTvlChart
          milestones={props.milestones}
          projectId={props.projectId}
        />
      )
    case 'onchain-costs':
      return (
        <ProjectCostsChart
          milestones={props.milestones}
          projectId={props.projectId}
        />
      )
    case 'activity':
      throw new Error('Not implemented')
  }
}
