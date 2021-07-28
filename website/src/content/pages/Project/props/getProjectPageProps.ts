import { Project, ProjectBridge, ProjectDetails } from '@l2beat/config'
import { L2Data } from '../../../L2Data'
import { PageMetadata } from '../../../PageMetadata'
import { ChartProps, getChartProps } from './getChartProps'
import { getHeaderProps, HeaderProps } from './getHeaderProps'
import { getPageMetadata } from './getPageMetadata'

export interface ProjectPageProps {
  header: HeaderProps
  chart: ChartProps
  details: ProjectDetails
  bridges: ProjectBridge[]
  metadata: PageMetadata
}

export function getProjectPageProps(
  project: Project,
  l2Data: L2Data
): ProjectPageProps {
  return {
    header: getHeaderProps(project, l2Data),
    chart: getChartProps(project),
    details: project.details,
    bridges: project.bridges,
    metadata: getPageMetadata(project),
  }
}
