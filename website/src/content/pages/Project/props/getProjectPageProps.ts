import { Project } from '@l2beat/config'
import { L2Data } from '../../../L2Data'
import { ProjectPageProps } from '../view/ProjectPage'
import { getChartProps } from './getChartProps'
import { getHeaderProps } from './getHeaderProps'
import { getNewsProps } from './getNewsProps'
import { getOverviewSectionPropsProps } from './getOverviewSectionProps'
import { getPageMetadata } from './getPageMetadata'
import { getRiskProps } from './getRiskProps'
import { getTechnologyProps } from './getTechnologyProps'

export function getProjectPageProps(
  project: Project,
  l2Data: L2Data
): ProjectPageProps {
  return {
    metadata: getPageMetadata(project),
    headerProps: getHeaderProps(project, l2Data),
    chartProps: getChartProps(project, l2Data),
    projectDetailsProps: {
      details: project.details,
      bridges: project.bridges,
      risks: getRiskProps(project),
      technology: getTechnologyProps(project),
      news: getNewsProps(project),
      overviewSectionProps: getOverviewSectionPropsProps(project),
    },
  }
}
