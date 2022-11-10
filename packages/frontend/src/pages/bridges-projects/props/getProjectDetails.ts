import { Bridge } from '@l2beat/config'
import { VerificationStatus } from '@l2beat/types'

import { getContractSection } from '../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../utils/project/getPermissionsSection'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getNewsSection } from './getNewsSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(
  bridge: Bridge,
  verificationStatus: VerificationStatus,
): ProjectDetailsProps {
  return {
    newsSection: getNewsSection(bridge),
    linkSection: getLinkSection(bridge),
    descriptionSection: getDescriptionSection(bridge, verificationStatus),
    riskSection: getRiskSection(bridge, verificationStatus),
    permissionsSection: getPermissionsSection(bridge, verificationStatus),
    contractsSection: getContractSection(bridge, verificationStatus),
    ...getTechnologyOverview(bridge),
  }
}
