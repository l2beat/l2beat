import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import type { ChartProject } from '~/components/core/chart/Chart'
import type { ActivityTimeRange } from '~/server/features/scaling/activity/utils/range'
import { ProjectActivityChart } from '../../chart/activity/ProjectActivityChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ActivitySectionProps extends ProjectSectionProps {
  id: 'activity'
  project: ChartProject
  milestones: Milestone[]
  category?: ProjectScalingCategory
  defaultRange: ActivityTimeRange
  dataSource: string | undefined
}

export function ActivitySection({
  project,
  milestones,
  category,
  defaultRange,
  dataSource,
  ...sectionProps
}: ActivitySectionProps) {
  return (
    <ProjectSection {...sectionProps}>
      {dataSource && <ChartDataSourceInfo dataSource={dataSource} />}
      <ProjectActivityChart
        milestones={milestones}
        project={project}
        category={category}
        defaultRange={defaultRange}
      />
    </ProjectSection>
  )
}
