import { Project } from '@l2beat/config'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getBridgeSection } from './getBridgeSection'
import { getNewsSection } from './getNewsSection'
import { getOverviewSection } from './getOverviewSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(project: Project): ProjectDetailsProps {
  return {
    details: project.details,
    bridgesSection: getBridgeSection(project),
    riskSection: getRiskSection(project),
    technologyOverview: getTechnologyOverview(project),
    newsSection: getNewsSection(project),
    overviewSection: getOverviewSection(project),
  }
}
