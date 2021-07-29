import { Project, ProjectBridge, ProjectDetails } from '@l2beat/config'
import { L2Data } from '../../../L2Data'
import { PageMetadata } from '../../../PageMetadata'
import { ChartProps, getChartProps } from './getChartProps'
import { getHeaderProps, HeaderProps } from './getHeaderProps'
import { getNewsProps, NewsItem } from './getNewsProps'
import { getOverviewProps, OverviewProps } from './getOverviewProps'
import { getPageMetadata } from './getPageMetadata'
import { getRiskProps, RiskProps } from './getRiskProps'
import { getTechnologyProps, TechnologyProps } from './getTechnologyProps'

export interface ProjectPageProps {
  header: HeaderProps
  chart: ChartProps
  details: ProjectDetails
  bridges: ProjectBridge[]
  metadata: PageMetadata
  risks?: RiskProps
  technology?: TechnologyProps
  news?: NewsItem[]
  overview: OverviewProps
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
    risks: getRiskProps(project),
    technology: getTechnologyProps(project),
    news: getNewsProps(project),
    overview: getOverviewProps(project),
  }
}
