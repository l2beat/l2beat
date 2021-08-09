import { Project } from '@l2beat/config'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getNewsProps } from './getNewsProps'
import { getOverviewSection } from './getOverviewSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(project: Project): ProjectDetailsProps {
  return {
    details: project.details,
    bridges: project.bridges,
    riskSection: getRiskSection(project),
    technology: getTechnologyOverview(project),
    news: getNewsProps(project),
    overviewSection: getOverviewSection(project),
  }
}
