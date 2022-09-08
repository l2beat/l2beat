import { Layer2 } from '@l2beat/config'

import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getNewsSection } from './getNewsSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(project: Layer2): ProjectDetailsProps {
  return {
    newsSection: getNewsSection(project),
    linkSection: getLinkSection(project),
    descriptionSection: getDescriptionSection(project),
    riskSection: getRiskSection(project),
    ...getTechnologyOverview(project),
  }
}
