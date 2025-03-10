import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import type { ProjectTokens } from '~/server/features/scaling/tvs/tokens/get-tokens-for-project'
import { ProjectActivityChart } from '../../chart/activity/project-activity-chart'
import { ProjectTvsChart } from '../../chart/tvs/project-tvs-chart'
import { ProjectStackedTvsChart } from '../../chart/tvs/stacked/project-stacked-tvs-chart'
import { ProjectSection } from './project-section'
import type { ProjectSectionId, ProjectSectionProps } from './types'

type ChartSectionId = Extract<ProjectSectionId, 'tvs' | 'activity'>

/* 
  Note (torztomasz):
  I know this props with optional tokens and stacked is kinda bad as it is only used for TVS chart.
  Although I couldn't get type union working with get-l2-project-details.tsx or get-l3-project-details.tsx.
  You can give it a shot if you want.
  Shots counter: 0
*/
export interface ChartSectionProps extends ProjectSectionProps {
  id: ChartSectionId
  isBridge?: boolean
  stacked?: boolean
  tokens?: ProjectTokens
  projectId: string
  milestones: Milestone[]
  category?: ProjectScalingCategory
  projectName?: string
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
    case 'tvs':
      if (props.stacked) {
        return (
          <ProjectStackedTvsChart
            milestones={props.milestones}
            projectId={props.projectId}
            tokens={props.tokens}
            isBridge={!!props.isBridge}
          />
        )
      }
      return (
        <ProjectTvsChart
          milestones={props.milestones}
          projectId={props.projectId}
          tokens={props.tokens}
          isBridge={!!props.isBridge}
        />
      )
    case 'activity':
      return (
        <ProjectActivityChart
          milestones={props.milestones}
          projectId={props.projectId}
          category={props.category}
          projectName={props.projectName}
        />
      )
  }
}
