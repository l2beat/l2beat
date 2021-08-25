import { Project } from '@l2beat/config'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getBridgeSection } from './getBridgeSection'
import { getDescriptionSection } from './getDescriptionSection'
import { getNewsSection } from './getNewsSection'
import { getOverviewSection } from './getOverviewSection'
import { getLinkSection } from './getLinkSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(project: Project): ProjectDetailsProps {
  return {
    old: {
      details: project.details,
      bridgesSection: getBridgeSection(project),
      newsSection: getNewsSection(project),
      overviewSection: getOverviewSection(project),
    },
    newsSection: getNewsSection(project),
    linkSection: getLinkSection(project),
    descriptionSection: getDescriptionSection(project),
    riskSection: getRiskSection(project),
    ...getTechnologyOverview(project),
  }
}
