import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/shared'

import { getContractSection } from '../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../utils/project/getPermissionsSection'
import { getRiskValues } from '../../../utils/risks/values'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Layer2,
  verificationStatus: VerificationStatus,
): ProjectDetailsProps {
  return {
    linkSection: getLinkSection(project),
    descriptionSection: getDescriptionSection(project, verificationStatus),
    riskAnalysis: { riskValues: getRiskValues(project.riskView) },
    permissionsSection: getPermissionsSection(project, verificationStatus),
    contractsSection: getContractSection(project, verificationStatus),
    milestones: project.milestones,
    knowledgeNuggets: project.knowledgeNuggets,
    isUpcoming: project.isUpcoming,
    ...getTechnologyOverview(project),
  }
}
