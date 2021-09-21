import { Project } from '@l2beat/config'

import { L2Data } from '../../../L2Data'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getNewsSection } from './getNewsSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Project,
  l2Data: L2Data
): ProjectDetailsProps {
  return {
    newsSection: getNewsSection(project),
    linkSection: getLinkSection(project, l2Data),
    descriptionSection: getDescriptionSection(project),
    riskSection: getRiskSection(project),
    ...getTechnologyOverview(project),
  }
}
