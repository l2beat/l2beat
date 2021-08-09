import { Project } from '@l2beat/config'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getNewsProps } from './getNewsProps'
import { getOverviewSection } from './getOverviewSection'
import { getRiskProps } from './getRiskProps'
import { getTechnologyProps } from './getTechnologyProps'

export function getProjectDetails(project: Project): ProjectDetailsProps {
  return {
    details: project.details,
    bridges: project.bridges,
    risks: getRiskProps(project),
    technology: getTechnologyProps(project),
    news: getNewsProps(project),
    overviewSection: getOverviewSection(project),
  }
}
