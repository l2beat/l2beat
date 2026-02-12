import type { Milestone, ProjectScalingCategory } from '@l2beat/config'
import { ProjectId } from '@l2beat/shared-pure'
import { EthereumActivityChart } from '~/components/chart/activity/EthereumActivityChart'
import { ChartDataSourceInfo } from '~/components/chart/ChartDataSourceInfo'
import type { ChartProject } from '~/components/core/chart/Chart'
import type { ChartRange } from '~/utils/range/range'
import { ProjectActivityChart } from '../../chart/activity/ProjectActivityChart'
import { ProjectSection } from './ProjectSection'
import type { ProjectSectionProps } from './types'

export interface ActivitySectionProps extends ProjectSectionProps {
  id: 'activity'
  project: ChartProject
  milestones: Milestone[]
  category?: ProjectScalingCategory
  defaultRange: ChartRange
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
      {project.id === ProjectId.ETHEREUM ? (
        <EthereumActivityChart
          milestones={milestones}
          project={project}
          category={category}
          defaultRange={defaultRange}
        />
      ) : (
        <ProjectActivityChart
          milestones={milestones}
          project={project}
          category={category}
          defaultRange={defaultRange}
        />
      )}
    </ProjectSection>
  )
}
