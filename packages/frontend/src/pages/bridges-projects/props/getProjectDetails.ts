import { Bridge } from '@l2beat/config'

import { getContractSection } from '../../../utils/project/getContractSection'
import { getPermissionsSection } from '../../../utils/project/getPermissionsSection'
import { ProjectDetailsProps } from '../view/ProjectDetails'
import { getDescriptionSection } from './getDescriptionSection'
import { getLinkSection } from './getLinkSection'
import { getNewsSection } from './getNewsSection'
import { getRiskSection } from './getRiskSection'
import { getTechnologyOverview } from './getTechnologyOverview'

export function getProjectDetails(bridge: Bridge): ProjectDetailsProps {
  return {
    newsSection: getNewsSection(bridge),
    linkSection: getLinkSection(bridge),
    descriptionSection: getDescriptionSection(bridge),
    riskSection: getRiskSection(bridge),
    permissionsSection: getPermissionsSection(bridge),
    contractsSection: getContractSection(bridge),
    ...getTechnologyOverview(bridge),
  }
}
