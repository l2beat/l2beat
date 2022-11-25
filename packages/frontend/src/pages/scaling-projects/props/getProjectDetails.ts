import { Layer2 } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

import { getContractSection } from '../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../utils/project/getPermissionsSection'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  project: Layer2,
  verificationStatus: VerificationStatus,
): ProjectDetailsProps {
  return {
    linkSection: getLinkSection(project),
    descriptionSection: getDescriptionSection(project, verificationStatus),
    riskSection: getRiskSection(project, verificationStatus),
    permissionsSection: getPermissionsSection(project, verificationStatus),
    contractsSection: getContractSection(project, verificationStatus),
    milestones: project.milestones,
    ...getTechnologyOverview(project),
  }
}
