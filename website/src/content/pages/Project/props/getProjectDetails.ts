import { Project } from '@l2beat/config'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getBridgeSection } from './getBridgeSection'
import { getDescriptionSection } from './getDescriptionSection'
import { getNewsSection } from './getNewsSection'
import { getOverviewSection } from './getOverviewSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(project: Project): ProjectDetailsProps {
  const newsSection = getNewsSection(project)
  const overviewSection = getOverviewSection(project)
  return {
    old: {
      details: project.details,
      bridgesSection: getBridgeSection(project),
      newsSection,
      overviewSection: getOverviewSection(project),
    },
    newsSection,
    overviewSection,
    descriptionSection: getDescriptionSection(project),
    riskSection: getRiskSection(project),
    ...getTechnologyOverview(project),
  }
}
